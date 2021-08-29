import React from 'react';
import logo from './logo.svg';
import './App.css';
import {graphModel, GraphVisualizer, Template, Toolbar, ToolButtonList } from 'graphlabs.core.template';
import {IGraph, IVertex , IEdge, DirectedGraph, GraphGenerator} from "graphlabs.core.graphs";

import {Matrix, MatrixRow,} from 'graphlabs.core.lib';
 class App extends  Template {
   check_count: number = 0;
   matrix: number [][] = [[0, 1, 1, 1],
     [0, 0, 1, 0],
     [0, 0, 0, 1],
     [0, 1, 0, 0]];
   graph: IGraph<IVertex, IEdge> = GraphGenerator.generate(0);

   constructor(props: {}) {
     super(props);
     this.getArea = this.getArea.bind(this);
     this.calculate = this.calculate.bind(this);

   }


   componentWillMount() {
     //для инициализации графа
     let graphModel: IGraph<IVertex, IEdge> = new DirectedGraph() as unknown as IGraph<IVertex, IEdge>;
     let init: (graph: IGraph<IVertex, IEdge>) => void;
     init = function (graph: IGraph<IVertex, IEdge>) {
       graphModel = graph;
     }
     init(this.graph);
   }


   getTaskToolbar() {
     Toolbar.prototype.getButtonList = () => {
       function beforeComplete(this: App): Promise<{ success: boolean; fee: number }> {
         return new Promise((resolve => {
           resolve(this.calculate());
         }));
       }

       ToolButtonList.prototype.beforeComplete = beforeComplete.bind(this);
       ToolButtonList.prototype.help = () =>
           'В данном задании необходимо построить  ориентированный граф по данной матрице смежности';


       return ToolButtonList;
     };
     return Toolbar;
   }

   protected task(): React.SFC<{}> {
     return () =>
         <div>
           <form>
             <span> Матрица смежности </span>
             <Matrix rows={this.matrix.length}
                     columns={this.matrix.length}
                     readonly={true}
                     defaultValues={this.matrix}
             />
           </form>

         </div>
   }


   protected getArea(): React.SFC<{}> {
     return () => <GraphVisualizer
         graph={graphModel}
         adapterType={'writable'}
         incidentEdges={false}
         weightedEdges={false}
         namedEdges={true}
         vertexNaming={true}
         withoutDragging={false}
         isDirected={true}
     />;
   }


   private get_matrixAdjacency(): number [][] {
     let result: number[][] = [];
     let tmp: number [] = []
     let verticies_name: string[] = []
     let c: number = 0;
     let i: number = 0;
     let j: number = 0;
     let v1: IVertex;
     let v2: IVertex;

     for (c = 0; c < graphModel.vertices.length; c++) {
       tmp.push(0);
       verticies_name.push(graphModel.vertices[c].name)
     }

     for (i = 0; i < graphModel.vertices.length; i++)
     {
       result.push([]);
       verticies_name.push(graphModel.vertices[i].name)
       for (j = 0; j < graphModel.vertices.length; j++)
       {
         result[i].push(0);
       }

     }

     let edges: IEdge[] = graphModel.edges;

     for (c = 0; c< edges.length; c++) {
       v1 = edges[c].vertexOne;
       v2 = edges[c].vertexTwo;

       i = verticies_name.indexOf(v1.name)
       j = verticies_name.indexOf(v2.name)

       result[i][j]=1

       i=0;
       j=0;
     }

     return result;
   }




   private graph_check(): boolean
   {
     let flag:boolean = true;
     let matrix_by_student_graph = this.get_matrixAdjacency();
     console.log(matrix_by_student_graph)


     let i:number=0;
     let j:number=0;

     if(graphModel.vertices.length === this.matrix.length)
     {
       while(flag && i<graphModel.vertices.length)
       {
         while (flag && j< graphModel.vertices.length)
         {
           if (this.matrix[i][j] !== matrix_by_student_graph[i][j])
           {
             flag=false;
             this.check_count++;
           }
         }
       }

     }
     else
     {
       flag=false;
       this.check_count ++;
     }

     console.log(flag)
     return flag;

   }


   calculate()
   {
     let isChecked = this.graph_check();
     let res=0;
     if(!isChecked)
     {
       res = (graphModel.vertices.length+graphModel.edges.length)*this.check_count
     }
     return {success: res === 0, fee: res}
   }
 }
export default App;
