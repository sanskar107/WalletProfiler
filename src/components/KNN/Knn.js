import EpnsSDK from "@epnsproject/backend-sdk-staging"
import {kdTree, BinaryHeap} from "kd-tree-javascript/kdTree"

// async function getSubs(sdk) {
//   const response = await sdk.getSubscribedUsers();
//   return response;
// }

const knn = () => {
    var points = [
        {x: 1, y: 2},
        {x: 3, y: 4},
        {x: 5, y: 6},
        {x: 7, y: 8}
    ];

    var distance = function(a, b){
        return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2);
    }

    console.log(kdTree);
    var tree = new kdTree(points, distance, ["x", "y"]);

    var nearest = tree.nearest({ x: 5, y: 5 }, 2);

    console.log(nearest);

}

export default knn;
