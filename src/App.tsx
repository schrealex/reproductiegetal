import React, { useEffect, useState } from 'react';
import { getReproductiegetal } from "./service/ReproductiegetalApi";
import './App.scss';
import dayjs from "dayjs";

function App() {

    const [huidigeReproductieGetal, setHuidigeReproductieGetal] = useState(0);
    const [huidigeReproductieGetalDatum, setHuidigeReproductieGetalDatum] = useState('');

    const getGemiddeldeVanArray = (array: Array<number>) => {
        return array.reduce((a, b) => a + b) / 2;
    }

    const getGetalMetTweeDecimalen = (number: number) => {
        return Math.round((number + Number.EPSILON) * 100) / 100;
    };

    const getDatumVanTweeWekenTerug = () => {
        return dayjs(new Date()).subtract(14, 'day').format('YYYY-MM-DD');
    }

    const getReproductieGetalDataVanTweeWekenTerug = (data: Array<Object>) => {
        return data.find((d: any) => d.Date === getDatumVanTweeWekenTerug());
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getLaatsteReproductieGetal = (data: Array<Object>): any => {
        return data.filter((d: Object) => (Object.keys(d).indexOf('Rt_low') !== -1 && Object.keys(d).indexOf('Rt_up') !== -1)).pop()
    }

    useEffect(() => {
        getReproductiegetal().then(({ data }) => {
            const dataTweeWekenGeleden: any = getReproductieGetalDataVanTweeWekenTerug(data);
            if (dataTweeWekenGeleden) {
                setHuidigeReproductieGetal(getGetalMetTweeDecimalen(getGemiddeldeVanArray([Number(dataTweeWekenGeleden.Rt_low), Number(dataTweeWekenGeleden.Rt_up)])));
                setHuidigeReproductieGetalDatum(dataTweeWekenGeleden.Date);
            } else {
                setHuidigeReproductieGetal(0);
                setHuidigeReproductieGetalDatum(new Date().toString());
            }

        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="App">
            <div className="reproductiegetal-data">
                Het laatst bekende COVID-19 reproductiegetal van <span className="datum">{huidigeReproductieGetalDatum}</span> is: <a
                href="https://data.rivm.nl/geonetwork/srv/dut/catalog.search#/metadata/ed0699d1-c9d5-4436-8517-27eb993eab6e" target="_blank"
                rel="noopener noreferrer">
                <span className=" getal">{huidigeReproductieGetal}</span>
            </a>
                <p className=" uitleg">
                    Het reproductiegetal laat zien hoe snel het virus zich verspreidt. Dit getal geeft aan hoeveel mensen gemiddeld besmet worden door
                    één patiënt met COVID-19.
                </p>
            </div>
        </div>
    );
}

export default App;
