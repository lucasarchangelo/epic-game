import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, ProgressBar, Row, Spinner } from 'react-bootstrap'
import Layout from '../../components/Layout'
import { Web3Helper, Web3Object } from "../../helpers/web3_helper";
import Web3 from "web3";
import CardHero from '../../components/CardHero';

export default function FightIndex() {

    class NFTAttributes {
        characterIndex: string = "";
        attackDamage: string = "";
        hp: string = "";
        imageURI: string = "";
        maxHp: string = "";
        name: string = "";
    }

    const [accounts, setAccounts] = useState(Array<string>);
    const [price, setPrice] = useState("");
    const [web3, setWeb3] = useState(new Web3());
    const [myNFT, setMyNFT] = useState(new NFTAttributes());
    const [messageError, setMessageError] = useState("");
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        startSubject();
    }, []);

    const getPrice = async () => {
        const price = await Web3Helper.Instance.getSaleInstance().methods.getPrice().call();
        setPrice(price);
    };

    const getNFT = async (account: string) => {
        const myNft = await Web3Helper.Instance.getNFTInstance().methods.getNFT(account).call();
        setMyNFT(formatNFT(myNft));
    }

    const formatNFT = (nft: NFTAttributes) => {
        return {
            characterIndex: nft["characterIndex"],
            attackDamage: nft["attackDamage"],
            hp: nft["hp"],
            imageURI: nft["imageURI"],
            maxHp: nft["maxHp"],
            name: nft["name"],
        }
    }

    const startSubject = async () => {
        Web3Helper.Instance.web3Objects.subscribe(async (result: Web3Object) => {
            setConnected(result.connected);
            if (result.connected) {
                setWeb3(result.web3);
                setAccounts(result.accounts);
                await getPrice();
                await getNFT(result.accounts[0]);
            }
        });
    };

    const buyNFT = async () => {
        setMessageError("");
        setLoading(true);
        try {
            await Web3Helper.Instance.getSaleInstance()
                .methods.buyCharacter()
                .send({ from: accounts[0], value: price });
            await getNFT(accounts[0]);
        } catch (err: any) {
            console.log("Error", err);
            setMessageError(err.message);
        }
        setLoading(false);
    };

    return (
        <Layout>
            <div className="content_site">
                <Container>
                    {connected ?
                        <Row>
                            <Col sm={12} md={6}>
                                <p className="home_text">
                                    That is your chance to make this world better. You can try your luck to get an epic CAT and fight against the BAD DOGS.
                                    <br />
                                    We have some options here:
                                </p>
                                <p className="home_text"></p>
                                <ul className="text_site_color">
                                    <li>Comom Cats</li>
                                    <li>Uncomom Cats</li>
                                    <li>Rare Cats</li>
                                    <li>Epic Cats</li>
                                </ul>
                                {!myNFT.name ||
                                    <div className="home_text">
                                        Your NFT:
                                        <CardHero status={myNFT}></CardHero>
                                    </div>
                                }
                            </Col>
                            <Col sm={12} md={6}>
                                <Row>
                                    <Col sm={12}>
                                        <Card>
                                            <Card.Img variant="top" src="https://i.imgur.com/EAFSXYp.png" />
                                            <Card.Body>
                                                <Card.Title>get your CAT Fighter here</Card.Title>
                                                <Card.Text>
                                                    It cost {web3.utils.fromWei(price, "ether")} ETH.
                                                </Card.Text>
                                                <Button onClick={buyNFT} variant="primary" disabled={loading}>
                                                    {!loading ||
                                                        <Spinner
                                                            as="span"
                                                            animation="grow"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />}
                                                    Buy my CAT
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                        <br />
                                        <Alert variant='danger' hidden={messageError === ""}>
                                            {messageError}
                                        </Alert>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        : <div>Connect your wallet!</div>}
                </Container>
            </div>
        </Layout>
    )
}
