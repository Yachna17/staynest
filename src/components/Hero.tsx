export default function Hero(){
    return(
        <div className="h-dvh flex flex-col gap-7 items-center justify-center" >
        <h1 className="text-9xl" >Find your next stay</h1>
        <p className="text-3xl" >Hotels listed by real hosts, browsed by real travelers.</p>
        <div className="flex gap-2">
        <button className="border border-black p-2 rounded-full" >Browse Hotels</button>
        <button className="border border-black p-2 rounded-full bg-black text-white " >Add Hotels</button>
        </div>
        </div>
    )
}