// import React from "react";
import { Line, Pie } from "@ant-design/charts";
import { Card, Row } from "antd";
import moment from "moment";

// function ChartComponent({ sortTransaction }) {
//   const data = sortTransaction.map((item) => {
//     return { date: item.date, amount: item.amount };
//   });

//   const config = {
//     data,
//     width: 800,
//     height: 400,
//     autoFit: false,
//     xField: "date",
//     yField: "amount",
//   };
//   const spendingConfig = {
//     data,
//     width: 800,
//     height: 400,
//     autoFit: false,
//     xField: "date",
//     yField: "amount",
//   };

//   let chart;
//   let pieChart;

//   return (
//     <>
//       <div>
//         <Line {...config} onReady={(charInstance) => (chart = charInstance)} />
//       </div>
//       <div>
//         <Pie
//           {...spendingConfig}
//           onReady={(charInstance) => (pieChart = charInstance)}
//         />
//       </div>
//     </>
//   );
// }

// export default ChartComponent;

import React from "react";

function ChartComponent({ transactions }) {
  const cardStyle = {
    boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
    margin: "2rem",
    borderRadius: "0.5rem",
    minWidth: "400px",
    flex: 1,
  };

  const processChartData = () => {
    const balanceData = [];
    const spendingData = {};

    transactions.forEach((transaction) => {
      const monthYear = moment(transaction.date).format("MMM YYYY");
      const tag = transaction.tag;

      if (transaction.type === "income") {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance +=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: transaction.amount });
        }
      } else {
        if (balanceData.some((data) => data.month === monthYear)) {
          balanceData.find((data) => data.month === monthYear).balance -=
            transaction.amount;
        } else {
          balanceData.push({ month: monthYear, balance: -transaction.amount });
        }

        if (spendingData[tag]) {
          spendingData[tag] += transaction.amount;
        } else {
          spendingData[tag] = transaction.amount;
        }
      }
    });

    const spendingDataArray = Object.keys(spendingData).map((key) => ({
      category: key,
      value: spendingData[key],
    }));

    return { balanceData, spendingDataArray };
  };

  const { balanceData, spendingDataArray } = processChartData();

  const balanceConfig = {
    data: balanceData,
    xField: "month",
    yField: "balance",
  };

  const spendingConfig = {
    data: spendingDataArray,
    angleField: "value",
    colorField: "category",
  };

  return (
    <>
      <Row gutter={16}>
        <Card bordered={true} style={cardStyle}>
          <h2>Financial Statistics</h2>
          <Line {...{ ...balanceConfig, data: balanceData }} />
        </Card>

        <Card bordered={true} style={{ ...cardStyle, flex: 0.45 }}>
          <h2>Total Spending</h2>
          {spendingDataArray.length == 0 ? (
            <p>Seems like you haven't spent anything till now...</p>
          ) : (
            <Pie {...{ ...spendingConfig, data: spendingDataArray }} />
          )}
        </Card>
      </Row>
    </>
  );
}

export default ChartComponent;
