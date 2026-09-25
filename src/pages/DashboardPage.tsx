export default function DashboardPage(){
    return(
        <>
        <div className="grid grid-cols-2 items-center px-10 " >
            <h1 className="text-xl justify-self-start" >My hotels</h1>
            <button className="bg-black text-white font-medium justify-self-end" >+ Add hotel</button>
        </div>
        
        </>
    )
}