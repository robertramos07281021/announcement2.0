import{m as a,r as o,j as t,c as r}from"./index-D0haHgcj.js";const m=r`
  query getAllAnnouncement {
    getAllAnnouncement {
      _id
      department {
        name
        _id
        branch {
          _id
          name
        }
      }
      main {
        mute
        type
        value
      }
      side {
        mute
        type
        value
      }
    }
  }
`,f=r`
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
`,h=()=>{const{data:d,refetch:n}=a(m,{notifyOnNetworkStatusChange:!0}),{data:i,refetch:c}=a(f,{notifyOnNetworkStatusChange:!0});o.useEffect(()=>{(async()=>(await n(),await c()))()},[]);const u=e=>({text:t.jsx("div",{className:"text-xs items-center flex justify-center h-full w-full text-center font-bold p-2",children:e?.value}),images:t.jsx("img",{src:`/uploads/${e?.value}`,alt:"image",className:"p-2 w-full h-full"}),video:t.jsx("video",{controls:!0,loop:!0,muted:!0,autoPlay:!0,className:"h-full w-full p-2 ",children:t.jsx("source",{src:`/uploads/${e?.value}`,type:"video/mp4"})})})[e?.type];return t.jsx("div",{className:"w-full  bg-gray-100 p-4",children:t.jsxs("div",{className:"flex gap-4 h-full w-full flex-col",children:[t.jsx("div",{className:"font-black uppercase text-black text-2xl",children:"Dashboard"}),t.jsx("div",{className:"grid grid-cols-6 gap-4 w-full h-full grid-rows-4",children:d?.getAllAnnouncement.map(e=>{const s=i?.findUsers.filter(l=>l.department._id===e.department._id).map(l=>l.onTv);return t.jsxs("div",{className:" w-full rounded-md shadow-sm hover:scale-105 flex flex-col transition-all border border-slate-300 bg-slate-200 h-full",children:[" ",t.jsxs("h1",{className:"text-sm border border-slate-200 font-bold text-center rounded bg-slate-500 text-white m-2",children:[e.department.name," -"," ",e.department.branch.name]}),e?.main&&s&&s?.includes(!0)?u(e?.main):t.jsx("div",{className:"w-full h-full font-medium text-center flex items-center justify-center italic text-slate-400",children:"The TV is not used.."})]},e._id)})})]})})};export{h as default};
