import{r as n,m as y,y as E,j as e,c as o}from"./index-DRVRfFaW.js";import{u as b,C as S}from"./mutations-DcwFGGuV.js";var N=(r=>(r.ADMIN="ADMIN",r.USER="USER",r))(N||{});const T=o`
  query findUsers {
    findUsers {
      department {
        branch {
          _id
          name
        }
        _id
        name
      }
      name
      type
      username
      _id
      onTv
    }
  }
`,U=o`
  query getDepts {
    getDepts {
      _id
      branch {
        _id
        name
      }
      name
    }
  }
`,R=o`
  mutation updateAccount($id: ID!, $input: InputCreatingAccount) {
    updateAccount(id: $id, input: $input) {
      message
      success
    }
  }
`,M=o`
  mutation createAccount($input: InputCreatingAccount) {
    createAccount(input: $input) {
      message
      success
    }
  }
`,$=o`
  mutation deleteAccount($_id: ID!) {
    deleteAccount(_id: $_id) {
      message
      success
    }
  }
`,O=()=>{const[r,i]=n.useState(!1),[d,u]=n.useState(null),[p,m]=n.useState(null),[s,c]=n.useState({username:null,type:null,name:null,department:null}),{data:A,refetch:f}=y(T,{notifyOnNetworkStatusChange:!0}),{data:C,refetch:v}=y(U,{notifyOnNetworkStatusChange:!0}),h=n.useCallback(async()=>{await v(),await f()},[v,f]);n.useEffect(()=>{h()},[]);const x=n.useCallback(t=>{h(),c({username:null,type:null,name:null,department:null}),i(!1),u(null),m(null),E(t)},[h,i,u,m]),[g]=b(M,"createAccount",x),[w]=b(R,"updateAccount",x),[j]=b($,"deleteAccount",x),k=n.useCallback(async()=>{await j({variables:{_id:p?._id}})},[j,p]),D=n.useCallback(async t=>{t.preventDefault(),await w({variables:{id:d?._id,input:s}})},[w,s,d]),_=n.useCallback(async t=>{t.preventDefault(),await g({variables:{input:s}})},[s,g]);return e.jsxs(e.Fragment,{children:[p&&e.jsx(S,{color:"red",yes:k,no:()=>m(null),message:"Are you sure you want to delete account?"}),(r||d)&&e.jsx("div",{className:"absolute w-full h-full top-0 left-0 overflow-hidden z-100",children:e.jsxs("div",{className:"relative w-full h-full flex items-center justify-center",children:[e.jsx("div",{className:"absolute cursor-pointer w-full h-full z-10 top-0 left-0 bg-black/10 backdrop-blur-xs",onClick:()=>{i(!1),u(null)}}),e.jsxs("form",{className:"border-2 border-blue-800 rounded-md overflow-hidden shadow-2xl shadow-black/30 z-20 flex flex-col bg-white",onSubmit:r&&!d?_:D,children:[e.jsx("p",{className:"bg-blue-500 w-full border-b-2 border-blue-800 text-center py-2 font-black uppercase text-white",children:r&&!d?"Create an Account":"Update Account"}),e.jsx("div",{className:"w-full bg-blue-100 h-full flex flex-col items-center justify-center p-5",children:e.jsxs("div",{className:" grid grid-cols-2 gap-2",children:[e.jsxs("div",{className:"w-full flex flex-col text-left",children:[e.jsx("div",{children:"Username:"}),e.jsx("input",{type:"text",id:"username",autoComplete:"off",name:"username",value:s.username??"",onChange:t=>{const l=t.target.value.trim()===""?null:t.target.value;c(a=>({...a,username:l}))},className:"bg-white px-3 py-1 outline-none border rounded-sm shadow-md"})]}),e.jsxs("div",{className:"w-full flex flex-col text-left",children:[e.jsx("div",{children:"Name:"}),e.jsx("input",{type:"text",id:"name",autoComplete:"off",name:"name",value:s.name??"",onChange:t=>{const l=t.target.value.trim()===""?null:t.target.value;c(a=>({...a,name:l}))},className:"bg-white px-3 py-1 outline-none border rounded-sm shadow-md"})]}),e.jsxs("div",{className:"w-full flex flex-col text-left",children:[e.jsx("div",{children:"Type:"}),e.jsx("select",{name:"type",id:"type",className:"border bg-white rounded-sm shadow-md px-3 py-1 outline-none",value:s.type??"",onChange:t=>{const l=t.target.value.trim()===""?null:t.target.value;c(a=>({...a,type:l}))},children:Object.entries(N).map(([t,l])=>e.jsx("option",{value:l,children:l},t))})]}),e.jsxs("div",{className:"w-full flex flex-col text-left",children:[e.jsx("div",{children:"Department:"}),e.jsx("select",{name:"department",id:"department",value:s.department??"",onChange:t=>{const l=t.target.value.trim()===""?null:t.target.value;c(a=>({...a,department:l}))},className:"border bg-white rounded-sm shadow-md px-3 py-1 outline-none",children:C?.getDepts.map(t=>e.jsxs("option",{value:t._id,children:[t.name," - ",t?.branch?.name]},t._id))})]})]})}),e.jsx("div",{className:"w-full bg-blue-100 flex items-center px-4 pb-4",children:e.jsx("button",{type:"submit",className:"p-2 w-full px-3 bg-green-600 cursor-pointer hover:bg-green-700 transition-all font-black uppercase text-white rounded-md shadow-md border-green-800 border-2",children:"Submit"})})]})]})}),e.jsx("div",{className:"p-4 flex bg-gray-100 w-full h-full",children:e.jsxs("div",{className:" flex w-full overflow-hidden flex-col relative",children:[e.jsx("h1",{className:"text-2xl font-black uppercase",children:"Accounts"}),e.jsx("div",{className:"text-end flex w-full justify-end",children:e.jsx("div",{className:"py-1.5 border-2 cursor-pointer bg-green-600 hover:bg-green-700 transition-all font-black uppercase text-white rounded-md shadow-md border-green-800 px-7 ",onClick:()=>{i(t=>!t)},children:"create"})}),e.jsxs("div",{className:"flex flex-col h-full w-full mt-2 overflow-y-auto overflow-x-hidden",children:[e.jsxs("div",{className:"grid rounded-t-md text-shadow-xs border-2 border-blue-800 text-shadow-black grid-cols-5 px-3 py-1 font-black uppercase text-white bg-blue-500 sticky to-pink-100 top-0",children:[e.jsx("div",{children:"Name"}),e.jsx("div",{children:"Username"}),e.jsx("div",{children:"Type"}),e.jsx("div",{children:"Department"}),e.jsx("div",{className:"text-right mr-3.5",children:"Action"})]}),A?.findUsers.map((t,l)=>e.jsxs("div",{className:"grid grid-cols-5 border-x-2 last:border-b-2 last:rounded-b-md last:shadow-md hover:bg-blue-300 items-center font-semibold transition-all border-blue-800 px-3 py-1 odd:bg-blue-100 even:bg-blue-200 ",children:[e.jsx("div",{className:"first-letter:uppercase",children:t.name}),e.jsx("div",{children:t.username}),e.jsx("div",{children:t.type}),e.jsxs("div",{children:[t.department.name," - ",t?.department?.branch?.name]}),e.jsxs("div",{className:"flex gap-2 justify-end py-1",children:[e.jsx("button",{onClick:()=>{u(t),c(a=>({...a,username:t.username,type:t.type,name:t.name,department:t.department._id}))},className:"border-blue-800 border-2 hover:bg-blue-600 bg-blue-500 overflow-hidden rounded-md",children:e.jsx("div",{className:"p-2 hover:animate-spin transition-all cursor-pointer  text-white font-black",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:"2.5",stroke:"currentColor",className:"size-5",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"})})})}),e.jsx("button",{onClick:()=>{m(t)},className:"border-red-800 border-2 p-2 cursor-pointer text-white hover:bg-red-600 bg-red-500 overflow-hidden rounded-md",children:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor",className:"size-5",children:e.jsx("path",{fillRule:"evenodd",d:"M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z",clipRule:"evenodd"})})})]})]},l))]})]})})]})};export{O as default};
