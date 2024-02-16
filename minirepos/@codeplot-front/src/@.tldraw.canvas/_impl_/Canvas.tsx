import { Tooltip, TooltipTrigger } from "@adobe/react-spectrum";
import {
  Canvas as TLCanvas,
  TldrawEditor,
  TldrawEditorProps,
} from "@tldraw/editor";
import {
  ArrowShapeTool,
  ArrowShapeUtil,
  BookmarkShapeUtil,
  ContextMenu,
  DrawShapeTool,
  DrawShapeUtil,
  EraserTool,
  GeoShapeTool,
  GeoShapeUtil,
  HandTool,
  TldrawHandles as Handles,
  HighlightShapeTool,
  HighlightShapeUtil,
  TldrawHoveredShapeIndicator as HoveredShapeIndicator,
  LaserTool,
  LineShapeTool,
  LineShapeUtil,
  TldrawScribble as Scribble,
  SelectTool,
  TldrawSelectionBackground as SelectionBackground,
  TldrawSelectionForeground as SelectionForeground,
  TextShapeTool,
  TextShapeUtil,
  TldrawUi,
  VideoShapeUtil,
  ZoomTool,
} from "@tldraw/tldraw";

import "@tldraw/tldraw/tldraw.css";
import { observer } from "mobx-react";
import React, { useMemo } from "react";

import { CodeplotShapeUtil } from "@.tldraw.shapes";
import { overrides } from "./overrides";

import { appStore } from "@.core";
import { ToastQueue } from "@react-spectrum/toast";
import "katex/dist/katex.min.css";

import { useStore } from "./useStore";

import "./styles.css";

export const Canvas = observer((props: React.PropsWithChildren) => {
  const withDefaults: TldrawEditorProps = useMemo(
    () => ({
      initialState: "select",
      components: {
        Scribble,
        CollaboratorScribble: Scribble,
        SelectionForeground,
        SelectionBackground,
        Handles,
        HoveredShapeIndicator,
      },
      shapeUtils: [
        TextShapeUtil,
        BookmarkShapeUtil,
        DrawShapeUtil,
        GeoShapeUtil,
        LineShapeUtil,
        ArrowShapeUtil,
        HighlightShapeUtil,
        VideoShapeUtil,
        CodeplotShapeUtil,
      ],
      tools: [
        EraserTool,
        HandTool,
        LaserTool,
        ZoomTool,
        SelectTool,
        TextShapeTool,
        DrawShapeTool,
        GeoShapeTool,
        LineShapeTool,
        ArrowShapeTool,
        HighlightShapeTool,
      ],
    }),
    [],
  );

  const store = useStore({
    shapeUtils: withDefaults.shapeUtils!,
    snapshot: appStore.fileManager.openedFile!.tldrSnapshot,
    roomId: appStore.roomId,
    wsHost: appStore.wsHost,
  });

  return (
    <div className="codeplot-Canvas">
      <TldrawEditor
        {...withDefaults}
        store={store}
        onMount={appStore.setTldrEditor}
      >
        <TldrawUi forceMobile overrides={overrides} {...withDefaults}>
          <ContextMenu>
            <TLCanvas />
          </ContextMenu>
          {props.children}
        </TldrawUi>
      </TldrawEditor>
      <div className="codeplot-Canvas__BottomBar">
        <div className="codeplot-Canvas__BottomBar__Version">
          <span>v{import.meta.env.VITE_NPM_VERSION}</span>
        </div>
        <div className="codeplot-Canvas__BottomBar__RoomURL">
          <TooltipTrigger>
            <button
              className="codeplot-Canvas__BottomBar__RoomURL__CopyButton"
              aria-label="Copy WS URL to clipboard"
              onClick={() => {
                navigator.clipboard.writeText(appStore.wsUrl);
                ToastQueue.neutral("Room url copied to clipboard!");
              }}
            >
              {appStore.wsUrl}
            </button>
            <Tooltip>Copy to clipboard</Tooltip>
          </TooltipTrigger>
        </div>
      </div>
    </div>
  );
});
