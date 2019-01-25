import * as React                                                from 'react'
import { WindowSizeSensor }                                      from 'libreact'
import { ModelData, parseModel }                                 from '../lib/modelDataParser'
import { buildTexture }                                          from '../lib/textureBuilder'
import { prepareRenderData, createModelMeshes, createContainer } from '../lib/modelRenderer'
import { renderScene }                                           from '../lib/screneRenderer'
import { createModelController }                                 from '../lib/modelController'

type Props = {
  modelBuffer: ArrayBuffer
}

export const Renderer = (props: Props) => {
  // Canvas reference
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    if (canvasRef.current) {
      console.time('Parse model')
      const modelData: ModelData = parseModel(props.modelBuffer)
      console.timeEnd('Parse model')

      console.time('Prepare frames')
      const meshesRenderData = prepareRenderData(modelData)
      const textures = modelData.textures.map(texture => buildTexture(props.modelBuffer, texture))
      const meshes = createModelMeshes(meshesRenderData, modelData, textures)
      const controller = createModelController(meshes, meshesRenderData, modelData)
      console.timeEnd('Prepare frames')

      const container = createContainer(meshes)

      const scene = renderScene(canvasRef.current, controller)
      scene.add(container)

      controller.playAnimation(0)

      // scene.add(render§s(getBonePositions(modelData.bones)))
    }
  }, [])

  return (
    <WindowSizeSensor
      onChange={size => {
        // if (typeof props.onResize === 'function') {
        //   props.onResize(size.width, size.height)
        // }
      }}
    >
      {(state: any) => (
        <canvas
          ref={canvasRef}
          style={{
            width:  state.width + 'px',
            height: state.height + 'px'
          }}
        />
      )}
    </WindowSizeSensor>
  )
}
