
import { ImageOverlay } from 'react-leaflet'

const limitesMapaTermico: [[number, number], [number, number]] = [
    [-23.594788842703554, -46.43792264211302],
    [-23.46882893833961, -46.30141245633852]
]

function MapaCalor() {
    return (
        <ImageOverlay
            url="/mapas/mapa-termico.png"
            bounds={limitesMapaTermico}
            opacity={0.75}
            interactive={false}
        />
    )
}

export default MapaCalor
