import hotel from "../assets/hotel.jpg"

interface HotelCardProps {
    hotelName: string;
    city: string;
    price: number;
}

export default function HotelCard( { hotelName, city, price} : HotelCardProps ){
    return(
        <section className="flex-col  rounded-4xl p-5 bg-black text-white" >
        <img src={hotel} alt="hotel-image" className="h-80 w-90 rounded-4xl" ></img>
        <p className="mt-5  font-semibold  text-xl"> {hotelName} </p>
        <p className="text-sm" > {city} </p>
        <p> <span className="font-semibold" >${price}</span>/night </p>    
        </section>
    )
}