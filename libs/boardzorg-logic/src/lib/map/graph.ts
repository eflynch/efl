

export type Graph<N> = {
    nodes: Set<N>;
    edges: Map<N, N[]>;
    distances: Map<string, number>;
}

export const addNode = <N>(graph: Graph<N>, value: N) => {
    graph.nodes.add(value);
}

export const removeNode = <N>(graph: Graph<N>, value: N) => {
    graph.nodes.delete(value);
    graph.edges.forEach((destinations, location) => {
        if (destinations.includes(value)) {
            destinations.splice(destinations.indexOf(value), 1);
        }
        if (graph.distances.has([location, value].join("-"))) {
            graph.distances.delete([location, value].join("-"));
        }
        if (graph.distances.has([value, location].join("-"))) {
            graph.distances.delete([value, location].join("-"));
        }
    })
}

export const addEdge = <N>(graph: Graph<N>, from: N, to: N, distance: number) => {
    graph.edges.get(from)?.push(to);
    graph.distances.set([from, to].join("-"), distance);
}

export const removeEdge = <N>(graph: Graph<N>, from: N, to: N) => {
    if (graph.edges.get(from)?.includes(to)){
        const index = graph.edges.get(from)?.indexOf(to) as number;
        graph.edges.get(from)?.splice(index, 1);
    }
    if (graph.distances.has([from, to].join("-"))) {
        graph.distances.delete([from, to].join("-"));
    }
}

export const getDistances = <N>(graph: Graph<N>, from: N) => {
    return dijsktra(graph, from).distances;
};

export const distance = <N>(graph: Graph<N>, from: N, to: N) => {
    const {distances} = dijsktra(graph, from)
    if (distances.has(to)) {
        return distances.get(to) as number;
    }
    return Infinity;
}

const dijsktra = <N>(graph: Graph<N>, initial: N) => {
    const visited = new Map<N, number>();
    visited.set(initial, 0)
    const path = new Map<N, N>();

    const nodes = new Set(graph.nodes);

    while (nodes.size > 0) {
        let minN: N | undefined;
        nodes.forEach(node => {
            if (visited.has(node)) {
                if (!minN) {
                    minN = node;
                } else if ((visited.get(node) as number) < (visited.get(minN) as number)) {
                    minN = node;
                }
            }
        })

        if (minN === undefined) {
            break;
        }
        const definitelyMinN = minN as N;

        nodes.delete(minN);
        const currentWeight = visited.get(minN) as number;

        graph.edges.get(minN)?.forEach(edge => {
            const weight = currentWeight + (graph.distances.get([minN, edge].join("-")) as number);
            if (!visited.has(edge) || weight < (visited.get(edge) as number)) {
                visited.set(edge, weight);
                path.set(edge, definitelyMinN);
            }
        })
    }
    return {distances: visited, path};
}
