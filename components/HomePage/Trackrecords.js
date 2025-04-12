"use client";
import React, { useContext } from 'react';
import CountUp from "react-countup";
import { LanguageContext } from "../../app/context/LanguageContext";

export default function Trackrecords() {
  const { language, translations } = useContext(LanguageContext);
  return (
    <div className="py-12">
      <div className="mx-auto w-11/12">
        <h1 className="text-center text-2xl font-semibold text-custom-red">
          {translations.trackRecord.trackRecordTitle}
        </h1>
        <div className="grid gap-12 py-12 lg:grid-cols-3 lg:gap-0">
          <div className="text-center text-5xl text-custom-blue">
            <CountUp start={1} end={100} duration={2.75} suffix=" +"></CountUp>
            <p className="text-center text-xl text-custom-gray">
              Years of Our Legacy
            </p>
          </div>
          <div className="text-center text-5xl text-custom-blue">
            <CountUp start={1} end={1500} duration={2.75} suffix=" +"></CountUp>
            <p className="text-center text-xl text-custom-gray">
              Clients Served
            </p>
          </div>
          <div className="text-center text-5xl text-custom-blue">
            <CountUp
              start={1}
              end={6}
              duration={2.75}
              decimal=","
              prefix="$ "
              suffix=" billion+"
            ></CountUp>
            <p className="text-center text-xl text-custom-gray">
              of Disputes Resolved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
