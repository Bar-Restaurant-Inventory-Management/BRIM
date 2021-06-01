import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: '5/25/21',
        TestDrink1: 7.2,
    },
    {
        name: '5/26/21',
        TestDrink1: 1.2,
    },
    {
        name: '5/27/21',
        TestDrink1: 3.1,
    },
    {
        name: '6/28/21',
        TestDrink1: 3.0,
    },
    {
        name: '6/29/21',
        TestDrink1: 5.4,
    },
    {
        name: '5/30/21',
        TestDrink1: 2.7,
    },
    {
        name: '5/31/21',
        TestDrink1: 0,
    },
    {
        name: '6/1/21',
        TestDrink1: 5.2,
    },
];

export default function Chart(props) {

    return (
        <ResponsiveContainer width="100%" height={700}>
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="TestDrink1" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    )
}
