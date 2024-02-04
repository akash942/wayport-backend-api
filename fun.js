// import fs from "fs";


// const o = {
//   arr: [{ first: "hi" }, { second: "by" }],
// };

// const n = { arr: {} };

// o.arr.forEach((e, i) => {
//   console.log(e);
//   n.arr[i] = [];
//   o.arr.forEach((e) => {
//     n.arr[i].push(e);
//   });
//   console.log(typeof n.arr[i]);
// });

// fs.writeFileSync("smallexp.json", JSON.stringify(n));

// console.log(n);

// console.log(typeof([1,2,4]));

//turns out arrays are just objects in js
console.log(process.env.MAIN_CONNECTION_URI);
