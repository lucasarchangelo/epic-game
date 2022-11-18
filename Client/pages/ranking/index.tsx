import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import Layout from '../../components/Layout';
import { Web3Helper, Web3Object } from "../../helpers/web3_helper";


export default function Ranking() {

    const [connected, setConnected] = useState(false);
    const [ranking, setRanking] = useState(Array<any>);

    const getRanking = async () => {
        try {
            const ranking = await Web3Helper.Instance.getGameInstance().methods.getRanking().call();
            console.log(ranking);
            setRanking(ranking);
        } catch (err: any) {
            console.log(err.message);
        }
    }

    const startSubject = async () => {
        Web3Helper.Instance.web3Objects.subscribe(async (result: Web3Object) => {
            setConnected(result.connected);
            if (result.connected) {
                getRanking();
            }
        });
    };

    useEffect(() => {
        startSubject();
    }, []);

    return (
        <Layout>
            <div className="content_site">
                <Container>
                    {connected ?
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Address</th>
                                    <th>Damage dealt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ranking.map((element, index) =>
                                    <tr key={index}>
                                        <td>{index}</td>
                                        <td>{element["owner"]}</td>
                                        <td>{element["damageIndex"]}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        : <div>Connect your wallet!</div>}
                </Container>
            </div>
        </Layout>
    );
}
