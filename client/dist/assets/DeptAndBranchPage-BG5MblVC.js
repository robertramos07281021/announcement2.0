import{r as l,m as B,y,j as e,c as r}from"./index-CwRkXhSb.js";import{u as m,C as M}from"./mutations-BYSZn3dW.js";const P=r`
  mutation createNewBranch($name: String) {
    createNewBranch(name: $name) {
      message
      success
    }
  }
`,S=r`
  query GetBranches {
    getBranches {
      _id
      name
    }
  }
`,$=r`
  mutation updateBranch($input: InputBranch) {
    updateBranch(input: $input) {
      success
      message
    }
  }
`,H=r`
  mutation deleteBranch($id: ID!) {
    deleteBranch(id: $id) {
      message
      success
    }
  }
`,L=r`
  mutation createNewDepartment($input: InputDepartment) {
    createNewDepartment(input: $input) {
      message
      success
    }
  }
`,U=r`
  query getDepts {
    getDepts {
      _id
      name
      branch {
        _id
        name
      }
    }
  }
`,Z=r`
  mutation updateDepartment($input: InputDepartment) {
    updateDepartment(input: $input) {
      message
      success
    }
  }
`,z=r`
  mutation deleteDepartment($_id: ID!) {
    deleteDepartment(_id: $_id) {
      message
      success
    }
  }
`,q=()=>{const[i,o]=l.useState(null),[a,s]=l.useState(null),[c,n]=l.useState(null),[h,d]=l.useState(null),[p,b]=l.useState(null),{data:v,refetch:w}=B(S,{notifyOnNetworkStatusChange:!0}),{data:E,refetch:g}=B(U,{notifyOnNetworkStatusChange:!0}),x=l.useCallback(async()=>{await w(),await g()},[w,g]);l.useEffect(()=>{x()},[]);const u=l.useCallback(t=>{x(),s(null),o(null),n(null),d(null),b(null),y(t)},[x,s,o,d,b,y,n]),[C]=m(P,"createNewBranch",u),[k]=m($,"updateBranch",u),[N]=m(H,"deleteBranch",u),[A]=m(L,"createNewDepartment",u),[T]=m(Z,"updateDepartment",u),[j]=m(z,"deleteDepartment",u),D={BRANCH:{ADD:async()=>{await C({variables:{name:h}})},UPDATE:async()=>{await k({variables:{input:{_id:c?._id,name:h}}})}},DEPARTMENT:{ADD:async()=>{await A({variables:{input:{name:h,branch:p}}})},UPDATE:async()=>{await T({variables:{input:{_id:c?._id,name:h,branch:p}}})}}},_=l.useCallback(async t=>{t.preventDefault(),i&&a&&await D[a][i]()},[D,i,a]),R=l.useCallback(async()=>{a&&await{BRANCH:async()=>await N({variables:{id:c?._id}}),DEPARTMENT:async()=>{await j({variables:{_id:c?._id}})}}[a]()},[N,a,j,c]);return e.jsxs(e.Fragment,{children:[c&&!i&&a&&e.jsx(M,{color:"red",message:`Do you want to delete ${c.name} ${a}?`,yes:R,no:()=>n(null)}),i&&a&&e.jsxs("form",{className:"w-full h-full items-center justify-center absolute top-0 left-0 bg-white/10 backdrop-blur-xs z-100 flex",onSubmit:_,children:[e.jsx("div",{className:"absolute w-full h-full top-0 left-0 z-80",onClick:()=>{s(null),o(null),n(null),d(null),b(null)}}),e.jsxs("div",{className:"flex flex-col shadow-lg shadow-black/30 z-90 w-1/4 h-1/3 border-2 border-blue-800 rounded-md overflow-hidden bg-white",children:[e.jsxs("div",{className:"p-2 font-black uppercase text-white bg-blue-500 text-center border-b-2 border-blue-800",children:[i," ",a," "]}),e.jsxs("div",{className:"w-full bg-blue-100 gap-2 h-full p-5 flex items-center justify-center flex-col",children:[e.jsxs("label",{className:"w-full",children:[e.jsx("div",{children:"Name:"}),e.jsx("input",{type:"text",id:"name",autoComplete:"off",name:"name",value:h??"",onChange:t=>{const f=t.target.value.trim()===""?null:t.target.value;d(f)},className:"w-full outline-none bg-white shadow-md rounded-sm border px-2 p-1"})]}),a==="DEPARTMENT"&&e.jsxs("label",{className:"w-full",children:[e.jsx("div",{className:"",children:"Branch:"}),e.jsxs("select",{name:"selectBranch",id:"selectBranch",onChange:t=>{const f=t.target.value.trim()===""?null:t.target.value;b(f)},className:"w-full border px-2 p-1 bg-white rounded-sm shadow-md outline-none",value:p??"",children:[e.jsx("option",{value:"",children:"Select Branch"}),v?.getBranches.map(t=>e.jsx("option",{value:t._id,children:t.name},t._id))]})]}),e.jsx("div",{className:"flex gap-2 w-full",children:e.jsx("button",{className:"bg-green-600 hover:bg-green-700 border-2 border-green-800 rounded-md py-2 font-black uppercase text-white cursor-pointer transition-all w-full",type:"submit",children:"Submit"})})]})]})]}),e.jsxs("div",{className:"w-full h-full bg-gray-100 overflow-hidden flex flex-col p-4",children:[e.jsx("div",{className:"text-2xl font-black uppercase",children:"Dept & Branch"}),e.jsxs("div",{className:"w-full h-full mt-2 flex gap-2 overflow-hidden",children:[e.jsxs("div",{className:"w-full h-full flex flex-col overflow-hidden",children:[e.jsxs("div",{className:"bg-blue-500 items-center border-2 border-blue-800 px-3 py-2 font-black uppercase text-white rounded-t-md flex justify-between",children:[e.jsx("p",{className:"",children:"Branch"}),e.jsx("button",{onClick:()=>{o("ADD"),s("BRANCH")},className:"cursor-pointer bg-green-600 hover:bg-green-700 transition-all text-xs px-3 border-2 border-green-800 rounded-sm uppercase py-1",children:"create"})]}),e.jsx("div",{className:"w-full h-full flex flex-col overflow-y-auto",children:v?.getBranches.map(t=>e.jsxs("div",{className:"flex border-x-2 px-4 hover:bg-blue-300 transition-all last:border-b-2 last:rounded-b-md last:shadow-md even:bg-blue-100 items-center odd:bg-blue-200 border-blue-800 justify-between",children:[e.jsx("div",{className:"font-semibold",children:t.name}),e.jsxs("div",{className:"flex gap-2 py-2",children:[e.jsx("button",{onClick:()=>{o("UPDATE"),s("BRANCH"),n(t),d(t.name)},className:"border-blue-800 border-2 hover:bg-blue-600 bg-blue-500 overflow-hidden rounded-md",children:e.jsx("div",{className:"p-2 hover:animate-spin transition-all cursor-pointer  text-white font-black",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:"2.5",stroke:"currentColor",className:"size-5",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"})})})}),e.jsx("button",{onClick:()=>{n(t),s("BRANCH")},className:"border-red-800 border-2 p-2 cursor-pointer text-white hover:bg-red-600 bg-red-500 overflow-hidden rounded-md",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"size-5",children:e.jsx("path",{fillRule:"evenodd",d:"M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z",clipRule:"evenodd"})})})]})]},t._id))})]}),e.jsxs("div",{className:"w-full h-full flex flex-col overflow-hidden",children:[e.jsxs("div",{className:"bg-blue-500 items-center border-2 border-blue-800 px-3 py-2 font-black uppercase text-white rounded-t-md flex justify-between sticky top-0",children:[e.jsx("p",{children:"Department"}),e.jsx("button",{onClick:()=>{o("ADD"),s("DEPARTMENT")},className:"cursor-pointer bg-green-600 hover:bg-green-700 transition-all text-xs px-3 border-2 border-green-800 rounded-sm uppercase py-1",children:"create"})]}),e.jsx("div",{className:"w-full h-full flex flex-col overflow-y-auto",children:E?.getDepts.map(t=>e.jsxs("div",{className:"flex border-x-2 px-4 hover:bg-blue-300 transition-all last:border-b-2 last:rounded-b-md last:shadow-md even:bg-blue-100 items-center odd:bg-blue-200 border-blue-800 justify-between",children:[e.jsxs("div",{className:"font-semibold",children:[t?.name," - ",t?.branch?.name]}),e.jsxs("div",{className:"flex gap-2 py-2",children:[e.jsx("button",{onClick:()=>{o("UPDATE"),s("DEPARTMENT"),n(t),d(t.name),b(t.branch._id)},className:"border-blue-800 border-2 hover:bg-blue-600 bg-blue-500 overflow-hidden rounded-md",children:e.jsx("div",{className:"p-2 hover:animate-spin transition-all cursor-pointer  text-white font-black",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:"2.5",stroke:"currentColor",className:"size-5",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"})})})}),e.jsx("button",{onClick:()=>{n(t),s("DEPARTMENT")},className:"border-red-800 border-2 p-2 cursor-pointer text-white hover:bg-red-600 bg-red-500 overflow-hidden rounded-md",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"size-5",children:e.jsx("path",{fillRule:"evenodd",d:"M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z",clipRule:"evenodd"})})})]})]},t?._id))})]})]})]})]})};export{q as default};
