import * as React from "react"
import * as OBC from "openbim-components"
import { FragmentsGroup } from "bim-fragment"
import * as THREE from "three"
import { TodoCreator } from "../bim-components/TodoCreator"
import { SimpleQTO } from "../bim-components/SimpleQTO"

interface IViewerContext{
    viewer: OBC.Components | null
    setViewer: (viewer: OBC.Components | null) => void
}

export const ViewerContext = React.createContext<IViewerContext>({
    viewer:null,
    setViewer: () => {}
})

export function ViewerProvider(props:{children: React.ReactNode}){
    const [viewer, setViewer] = React.useState<OBC.Components | null> (null)
    return(
        <ViewerContext.Provider value = {{viewer, setViewer}}>
            {props.children}
        </ViewerContext.Provider>
    )
}

export function IFCViewer(){
    const {setViewer} = React.useContext(ViewerContext)
    let viewer : OBC.Components

    const createViewer = async () => {
      viewer = new OBC.Components();
      setViewer(viewer)

      const sceneComponent = new OBC.SimpleScene(viewer);
      sceneComponent.setup();
      viewer.scene = sceneComponent;
      const scene = sceneComponent.get();
      scene.background = null;

      const viewerContainer = document.getElementById(
        "viewer-container"
      ) as HTMLDivElement;
      const rendererComponent = new OBC.PostproductionRenderer(
        viewer,
        viewerContainer
      );
      //const rendererComponent = new OBC.SimpleRenderer(viewer,viewerContainer)
      viewer.renderer = rendererComponent;

      const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
      viewer.camera = cameraComponent;

      const raycasterComponent = new OBC.SimpleRaycaster(viewer);
      viewer.raycaster = raycasterComponent;

      viewer.init();
      cameraComponent.updateAspect();
      rendererComponent.postproduction.enabled = true;

      const fragmentManager = new OBC.FragmentManager(viewer);
      //fragmentManager.disposeGroup()

      function exportFragments(model: FragmentsGroup) {
        const fragmentBinary = fragmentManager.export(model);
        const blob = new Blob([fragmentBinary], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${model.name.replace(".ifc", "")}.frag`;
        a.click();
        URL.revokeObjectURL(url);
      }

      function exportProperties(model: FragmentsGroup) {
        const json = JSON.stringify(model.properties, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${model.name}`.replace(".ifc", "");
        a.click();
        URL.revokeObjectURL(url);
      }

      const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
      const material = new THREE.MeshStandardMaterial();
      const cube = new THREE.Mesh(boxGeometry, material);

      scene.add(cube);

      const ifcLoader = new OBC.FragmentIfcLoader(viewer);
      ifcLoader.settings.wasm = {
        path: "https://unpkg.com/web-ifc@0.0.44/",
        absolute: true,
      };

      const highlighter = new OBC.FragmentHighlighter(viewer);
      highlighter.setup();

      const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer);
      highlighter.events.select.onClear.add(() => {
        propertiesProcessor.cleanPropertiesList();
      });

      const classifier = new OBC.FragmentClassifier(viewer);
      const classificationWindow = new OBC.FloatingWindow(viewer);
      classificationWindow.visible = false;
      viewer.ui.add(classificationWindow);
      classificationWindow.title = "Model Groups";

      const classificationBtn = new OBC.Button(viewer);
      classificationBtn.materialIcon = "account_tree";

      classificationBtn.onClick.add(() => {
        classificationWindow.visible = !classificationWindow.visible;
        classificationBtn.active = classificationWindow.visible;
      });

      async function createModelTree() {
        const fragmentTree = new OBC.FragmentTree(viewer);
        await fragmentTree.init();
        await fragmentTree.update(["model", "storeys", "entities"]); //
        fragmentTree.onHovered.add((fragmentMap) => {
          highlighter.highlightByID("hover", fragmentMap);
        });
        fragmentTree.onSelected.add((fragmentMap) => {
          highlighter.highlightByID("select", fragmentMap);
        });
        const tree = fragmentTree.get().uiElement.get("tree");
        return tree;
      }

      const culler = new OBC.ScreenCuller(viewer);
      cameraComponent.controls.addEventListener("sleep", () => {
        culler.needsUpdate = true;
      });

      async function onModelLoaded(model: FragmentsGroup) {
        highlighter.update();
        scene.remove(cube);

        for (const fragment of model.items) {
          culler.add(fragment.mesh);
        }
        culler.needsUpdate = true;

        try {
          classifier.byModel(model.name, model);
          classifier.byStorey(model);
          classifier.byEntity(model);
          //classifier.get()
          const tree = await createModelTree();
          await classificationWindow.slots.content.dispose(true);
          classificationWindow.addChild(tree);

          propertiesProcessor.process(model);
          highlighter.events.select.onHighlight.add((fragmentMap) => {
            const expressID = [...Object.values(fragmentMap)[0]][0];
            propertiesProcessor.renderProperties(model, Number(expressID));
          });
        } catch (error) {
          alert(error);
        }
      }

      ifcLoader.onIfcLoaded.add(async (model) => {
        //exportFragments(model)
        //exportProperties(model)
        onModelLoaded(model);
      });

      fragmentManager.onFragmentsLoaded.add((model) => {
        //importFrag()
        importProperties(model);
      });

      const importFragmentBtn = new OBC.Button(viewer);
      importFragmentBtn.materialIcon = "upload";
      importFragmentBtn.tooltip = "Load FRAG";

      async function importFrag() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".frag";
        const reader = new FileReader();
        reader.addEventListener("load", async () => {
          const binary = reader.result;
          if (!(binary instanceof ArrayBuffer)) {
            return;
          }
          const fragmentBinary = new Uint8Array(binary);
          await fragmentManager.load(fragmentBinary);
        });
        input.addEventListener("change", () => {
          const filesList = input.files;
          if (!filesList) {
            return;
          }
          reader.readAsArrayBuffer(filesList[0]);
        });
        input.click();
      }

      function importProperties(model) {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        const reader = new FileReader();
        reader.addEventListener("load", async () => {
          const json = reader.result as string;
          if (!json) {
            return;
          }

          model.properties = JSON.parse(json);
          return;
        });
        input.addEventListener("change", () => {
          const filesList = input.files;
          if (!filesList) {
            return;
          }
          reader.readAsText(filesList[0]);
        });
        input.click();
      }

      importFragmentBtn.onClick.add(() => {
        importFrag();
      });

      const simpleQTO = new SimpleQTO(viewer);
      await simpleQTO.setup();

      const todoCreator = new TodoCreator(viewer);
      await todoCreator.setup();

      const propsFinder = new OBC.IfcPropertiesFinder(viewer);
      await propsFinder.init();

      propsFinder.onFound.add((fragmentIDMap) => {
        highlighter.highlightByID("select", fragmentIDMap);
      });

      const toolbar = new OBC.Toolbar(viewer);
      toolbar.addChild(
        ifcLoader.uiElement.get("main"),
        importFragmentBtn,
        classificationBtn,
        propertiesProcessor.uiElement.get("main"),
        fragmentManager.uiElement.get("main"),
        propsFinder.uiElement.get("main"),
        todoCreator.uiElement.get("activationButton"),
        simpleQTO.uiElement.get("activationBtn")
      );

      viewer.ui.addToolbar(toolbar);
    };

    React.useEffect(()=>{
        createViewer()
        return () => {viewer.dispose()}
    },[])

    return(
        <div
            id="viewer-container"
            className="dashboard-card"
            style={{ minWidth: 0, position: "relative" }}
        />
    )


}
