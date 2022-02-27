# Visualizer

Welcome to Visualizer! I built this web application because I was learning about algorithms, and I wanted to visualize them in action. Currently, there are sorting and pathfinding algorithms. I hope you enjoy playing around with this visualization tool just as much as I enjoyed building it.

You can access it here:
[https://visualizer-iota.vercel.app](https://visualizer-iota.vercel.app)

![pathfinding example](https://github.com/mtergel/visualizer/blob/main/maze.gif, "Pathfinder")
![sorting example](https://github.com/mtergel/visualizer/blob/main/sorting.gif, "Sorter")


## Algorithms

### Sorting
- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort
### Pathfinding
- A* algorithm
- Dijsktra algorithm
- Breadth first search
- Depth first search


## Getting started

First, install dependecies and run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3008](http://localhost:3008) with your browser to see the result.

The application uses tailwind for styling. There are component level styles inside the ```lib/components``` folder and global styles are stored in ```styles/globals.scss```

There are no global states in the application everything has a page specific state located in ```pages/*.tsx```

The main algorithms are located in ```lib/core``` and uses async/await patterns.