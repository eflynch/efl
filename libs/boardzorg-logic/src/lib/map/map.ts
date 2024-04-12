import { SpaceAdjacencyList, SpaceList } from "../state/space"
import { Graph, addNode, addEdge, getDistances, distance as graphDistance } from "./graph"

type SpaceSector = [string, number];

export const constructMapGraph = () =>{
    const graph:Graph<SpaceSector> = {nodes:new Set(), edges: new Map(), distances: new Map()}
    SpaceList.forEach(space => {
        const {name, sectors} = space;
        sectors.forEach(sector => {
            addNode(graph, [name, sector])
        })
        sectors.forEach(sector => {
            sectors.forEach(otherSector => {
                if (Math.abs(sector - otherSector) === 1 || Math.abs(sector - otherSector) === 0){
                    addEdge(graph, [name, sector], [name, otherSector], 0)
                }
            })
        })
        SpaceAdjacencyList.forEach(([a, b]) => {
            addEdge(graph, [a.name, a.sector], [b.name, b.sector], 1)
            addEdge(graph, [b.name, b.sector], [a.name, a.sector], 1)
        })
    })
    return graph
}

export const removeSector = (graph:Graph<SpaceSector>, sector:number) => {
    graph.nodes.forEach(node => {
        if (node[1] === sector){
            graph.nodes.delete(node)
        }
    })
}

export const removeSpace = (graph:Graph<SpaceSector>, space:string) => {
    graph.nodes.forEach(node => {
        if (node[0] === space){
            graph.nodes.delete(node)
        }
    })
}

export const deadendSector = (graph:Graph<SpaceSector>, sector:number) => {
    graph.nodes.forEach(node => {
        if (node[1] === sector){
            graph.edges.get(node)?.forEach(destination => {
                graph.edges.get(node)?.splice(graph.edges.get(node)?.indexOf(destination) as number, 1)
            })
        }
    })
}

export const validDestinations = (graph:Graph<SpaceSector>, space:string, sector:number, distance:number) => {
    const nodes = getDistances<SpaceSector>(graph, [space, sector])
    const validDestinations:SpaceSector[] = []
    nodes.forEach((d, node) => {
        if (d <= distance){
            validDestinations.push(node)
        }
    })
    return validDestinations
}

export const distance = (graph:Graph<SpaceSector>, spaceA:string, sectorA:number, spaceB:string, sectorB:number) => {
    return graphDistance(graph, [spaceA, sectorA], [spaceB, sectorB])
}
 