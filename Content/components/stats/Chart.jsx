import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: '5/30/21',
        TestDrink1: 12,
    },
    {
        name: '5/31/21',
        TestDrink1: 31,
    },
    {
        name: '6/1/21',
        TestDrink1: 3,
    },
    {
        name: '6/2/21',
        TestDrink1: 5,
    },
    {
        name: '6/3/21',
        TestDrink1: 7,
    },
    {
        name: '6/4/21',
        TestDrink1: 0,
    },
    {
        name: '6/5/21',
        TestDrink1: 2,
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
