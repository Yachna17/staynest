import placeholder from "../../assets/hotel.jpg";

interface HotelCardProps {
  hotelName: string;
  city: string;
  price: number;
  image: string | null;
}

export default function HotelCard({
  hotelName,
  city,
  price,
  image,
}: HotelCardProps) {
  return (
    <section className="  rounded-4xl p-5 bg-black text-white">
      <img
        src={image ?? placeholder}
        alt="hotel-image"
        className="h-64 w-full object-cover rounded-4xl"
      ></img>
      <p className="mt-5  font-semibold  text-xl"> {hotelName} </p>
      <p className="text-sm"> {city} </p>
      <p>
        {" "}
        <span className="font-semibold">${price}</span>/night{" "}
      </p>
    </section>
  );
}
