import React, { useState, useEffect } from 'react';
import { tenurePeriods } from './utils/constants';

const Main = () => {

	const [cost, setCost] = useState(0);
	const [interest, setInterest] = useState(10);
	const [fee, setFee] = useState(1);
	const [downPayment, setDownPayment] = useState(0);
	const [emi, setEmi] = useState(0);
	const [tenure, setTenure] = useState(12);

	useEffect(()=>{
		if(!(cost>0)){
			setEmi(0);
			setDownPayment(0);
		}
		setEmi(calculateEMI(downPayment));
	}, [tenure]);

	function numberWithCommas(x:any) {
  	if (x) return `₹ ${x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

	const calculateEMI = (amount: number) : any => {
		if(!cost) return;

		const loanAmt = cost- amount;
		const rate = interest / 100;
		const noOfYears = tenure / 12;
		
		//[P x R x (1+R)^N]/[(1+R)^N-1]
		const eMI = (loanAmt * rate * (1 + rate)**noOfYears) / ((1 + rate)**(noOfYears-1));
		return Number(eMI/12).toFixed(0);
	}

	const calculateDP = (emi: number) => {
		if(!cost) return;

		const dpPercent: any = 100 -(emi / calculateEMI(0)) * 100;
		return Number((dpPercent/100)*cost).toFixed(0);
	}

	const updateEMI = (e: any) => {
		e.preventDefault();
		if (!cost) return;
		setDownPayment(Number(e.target.value).toFixed(0));
		const resultingEMI = calculateEMI(Number(e.target.value)) ;
		setEmi(resultingEMI);
	}

	const updateDownPayment = (e: any) => {
		e.preventDefault();
		if (!cost) return;
		setEmi(Number(e.target.value).toFixed(0));
		const resultingDP = calculateDP(Number(e.target.value)) ;
		setDownPayment(resultingDP);
	}

	return (
    <div className="content">
      <h1>EMI CALCULATOR</h1>

      <h3>Total Asset Cost:</h3>
      <input
        type="number"
        value={cost}
        onChange={(e) => {
          setCost(e.target.value);
        }}
        placeholder="Total cost of Asset"
      />

      <h3>Interest Rate (in %):</h3>
      <input
        type="number"
        value={interest}
        onChange={(e) => {
          setInterest(e.target.value);
        }}
        placeholder="Interest Rate (in %)"
      />

      <h3>Processing Fee (in %):</h3>
      <input
        type="number"
        value={fee}
        onChange={(e) => {
          setFee(e.target.value);
        }}
        placeholder="Processing Fee (in %)"
      />

      <h3>Down Payment:</h3>
			<span> Total Down Payment - {numberWithCommas((Number(downPayment) + (cost-downPayment)*(fee/100)).toFixed(0))}</span>
      {/* <div> */}
      <input
        type="range"
        min={0}
        max={cost}
        className="slider"
        value={downPayment}
        onChange={updateEMI}
      />
      <div className="labels">
        <label>0%</label>
        <b>{downPayment}</b>
        <label>100%</label>
      </div>
      {/* </div> */}

      <h3>Loan Per Month:</h3>
			<span> Total Loan Amount - {numberWithCommas((emi*tenure).toFixed(0))}</span>
      {/* <div> */}
      <input
        type="range"
        min={calculateEMI(cost)}
        max={calculateEMI(0)}
        className="slider"
        value={emi}
        onChange={updateDownPayment}
      />
      <div className="labels">
        <label>{numberWithCommas(calculateEMI(cost))}</label>
        <b>{emi}</b>
        <label>{numberWithCommas(calculateEMI(0))}</label>
      </div>
      {/* </div> */}

      <h3>Tenure:</h3>
      <div className="tenure-container">
        {tenurePeriods.map((t) => {
          return (
            <button
              className={`tenure ${t === tenure ? "selected" : ""}`}
              onClick={() => {
                setTenure(t);
              }}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Main;
