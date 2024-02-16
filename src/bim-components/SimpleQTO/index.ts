import * as OBC from "openbim-components"
import { FragmentsGroup } from "bim-fragment"
import * as WEBIFC from "web-ifc"

type QtoResult = {[setName: string]:{[qtoName:string]: number}}

export class SimpleQTO extends OBC.Component<QtoResult> implements OBC.UI, OBC.Disposable{
    static uuid = "5f9d0109-2a3c-4058-8968-a737745f10f6"
    enabled = true
    private _components: OBC.Components
    private _qtoResult: QtoResult = {}

    uiElement = new OBC.UIElement<{
        activationBtn: OBC.Button
        qtoList: OBC.FloatingWindow
    }>()

    constructor(components: OBC.Components){
        super(components)
        this._components = components
        components.tools.add(SimpleQTO.uuid, this)
        this.setUI()
    }

    async setup(){
        const highlighter = await this._components.tools.get(OBC.FragmentHighlighter)
        highlighter.events.select.onHighlight.add(async (fragmentIdMap)=>{
           await this.sumQuantities(fragmentIdMap) 
        })
        highlighter.events.select.onClear.add(()=>{
            //this.dispose()
            this.resetQuantities()
            this.resetQtoUI()
        })
    }

    private setUI(){
        const activationBtn = new OBC.Button(this._components)
        activationBtn.materialIcon = "functions"

        const qtoList = new OBC.FloatingWindow(this._components)
        qtoList.title = "Quantification"
        this._components.ui.add(qtoList)
        qtoList.visible = false
        
        activationBtn.onClick.add(()=>{
            activationBtn.active = !activationBtn.active
            qtoList.visible = activationBtn.active
        })

        this.uiElement.set({activationBtn,qtoList})
    }

    async sumQuantities(fragmentIdMap:OBC.FragmentIdMap){
        const fragmentManager = await this._components.tools.get(OBC.FragmentManager)
        for (const fragmentId in fragmentIdMap){
            const fragment = fragmentManager.list[fragmentId]
            const model = fragment.mesh.parent
            if (!(model instanceof FragmentsGroup && model.properties)){continue}
            const properties = model.properties
            OBC.IfcPropertiesUtils.getRelationMap(
                properties, 
                WEBIFC.IFCRELDEFINESBYPROPERTIES,
                (setId, relatedIds) =>{
                    const set = properties[setId]
                    const expressIDs = fragmentIdMap[fragmentId]
                    const workingIDs = relatedIds.filter(id => expressIDs.has(id.toString()))
                    const {name: setName} = OBC.IfcPropertiesUtils.getEntityName(properties,setId)
                    
                    if(set.type !== WEBIFC.IFCELEMENTQUANTITY || workingIDs.length === 0 || !setName) {return}
                    if(!(setName in this._qtoResult)){this._qtoResult[setName] = {}}
                    OBC.IfcPropertiesUtils.getQsetQuantities(
                        properties,
                        setId,
                        (qtoId) =>{
                            const {name : qtoName }=OBC.IfcPropertiesUtils.getEntityName(properties,qtoId)
                            const {value} = OBC.IfcPropertiesUtils.getQuantityValue(properties, qtoId)
                            if((!qtoName || !value)){return}
                            if(!(qtoName in this._qtoResult[setName])) {this._qtoResult[setName][qtoName] = 0}
                            this._qtoResult[setName][qtoName] += value 
                        }
                    )
                }

            )
        }
        console.log(this._qtoResult)
        
        this.createQTOTree()
        //console.log(tree)
        
    }

    private async createQTOTree(){
        const qtoResult = this._qtoResult
        //await this.resetQtoUI()
        const qtoList = this.uiElement.get("qtoList")
        await this.resetQtoUI()
        //const tree = new OBC.TreeView(this._components)
        //tree.title = "QTO List"
        const firstLevelKeys = Object.keys(qtoResult)
        for (const firstLevelKey in firstLevelKeys){
            const secondaryTree = new OBC.TreeView(this._components)
            secondaryTree.title = firstLevelKeys[firstLevelKey]
            const firstLevelItems = qtoResult[firstLevelKeys[firstLevelKey]]
            for(const item in firstLevelItems){
                const value = firstLevelItems[item]
                const record = new OBC.SimpleUIComponent(
                    this._components,
                    `<p>${item}: ${value.toFixed(3)}</p>`)
                secondaryTree.addChild(record) 
            }
            qtoList.addChild(secondaryTree)
        }
        
    }

    async resetQtoUI(){
        const qtoList = this.uiElement.get("qtoList")
        await qtoList.slots.content.dispose(true)   
    }


    async dispose() {
        this.resetQuantities()
        this.uiElement.dispose()
    }

    resetQuantities(){
        this._qtoResult = {}
    }


    get(): QtoResult {
        return this._qtoResult
    }


}