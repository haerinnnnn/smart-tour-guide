import React from "react";
import { Pie } from "@ant-design/plots";

const CategoryPie: React.FC = () => {

    const data = [

        {
            type: "Đồng",
            value: 8,
        },

        {
            type: "Đá",
            value: 6,
        },

        {
            type: "Gốm",
            value: 7,
        },

        {
            type: "Gỗ",
            value: 3,
        },

        {
            type: "Khác",
            value: 2,
        },

    ];

    return (

        <Pie

            data={data}

            angleField="value"

            colorField="type"

            height={320}

            innerRadius={0.55}

            label={{
                text: "type",
                position: "outside",
            }}

            legend={{
                color: {
                    position: "bottom",
                },
            }}

        />

    );

};

export default CategoryPie;