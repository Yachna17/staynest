import HotelCard from "./HotelCard.tsx"

export default function HotelGrid(){
    return(
        <div className=" flex   justify-around" >
        <HotelCard hotelName="Sea View Inn" city="Goa" price={120} ></HotelCard>
        <HotelCard hotelName="HillSide Retreat" city="Manali" price={85} ></HotelCard>
        <HotelCard hotelName="Lakeview Suites" city="Udaipur" price={150} ></HotelCard>
        </div>
    )
}