import { Alert, Button, Card, Col, Container, ProgressBar, Row, Spinner } from 'react-bootstrap'
import Layout from '../../components/Layout'
import { Web3Helper, Web3Object } from "../../helpers/web3_helper";
import { useEffect, useState } from 'react';
import CardHero from '../../components/CardHero';
import { GiBroadsword } from 'react-icons/gi';
import Web3 from 'web3';

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
    const [myNFT, setMyNFT] = useState(new NFTAttributes());
    const [bigBoss, setBigBoss] = useState(new NFTAttributes());
    const [messageError, setMessageError] = useState("");
    const [loadingAtk, setLoadingAtk] = useState(false);
    const [loadingHeal, setLoadingHeal] = useState(false);
    const [loadingClaim, setLoadingClaim] = useState(false);
    const [connected, setConnected] = useState(false);
    const [web3, setWeb3] = useState(new Web3());

    const [healPrice, setHealPrice] = useState("");
    const [attackPrice, setAttackPrice] = useState("");
    const [winner, setWinner] = useState("");

    useEffect(() => {
        startSubject();
    }, []);

    const getNFT = async (account: string) => {
        try {
            const myNFT = await Web3Helper.Instance.getNFTInstance().methods.getNFT(account).call();
            setMyNFT(formatNFT(myNFT));
        } catch (err: any) {
            setMessageError(err.message);
        }
    }

    const getBigBoss = async () => {
        const bigBoss = await Web3Helper.Instance.getGameInstance().methods.getBossStatus().call();
        setBigBoss(formatNFT(bigBoss));
    }

    const getHealPrice = async () => {
        const healPrice = await Web3Helper.Instance.getGameInstance().methods.getHealPrice().call();
        setHealPrice(healPrice);
    }

    const getWinner = async () => {
        const winner = await Web3Helper.Instance.getGameInstance().methods.getWinner().call();
        console.log(winner, accounts[0]);
        setWinner(winner);
    }

    const getAttackPrice = async () => {
        const attackPrice = await Web3Helper.Instance.getGameInstance().methods.getAttackPrice().call();
        setAttackPrice(attackPrice);
    }

    const attackBoss = async () => {
        setMessageError("");
        setLoadingAtk(true);
        try {
            await Web3Helper.Instance.getGameInstance().methods.attackBoss().send({ from: accounts[0], value: attackPrice });
            await getNFT(accounts[0]);
            await getBigBoss();
            await getWinner();
        } catch (err: any) {
            setMessageError(err.message);
        }
        setLoadingAtk(false);
    }

    const healMyCat = async () => {
        setMessageError("");
        setLoadingHeal(true);
        try {
            await Web3Helper.Instance.getGameInstance().methods.healMyCat().send({ from: accounts[0], value: healPrice });
            await getNFT(accounts[0]);
            await getBigBoss();
            await getWinner();
        } catch (err: any) {
            setMessageError(err.message);
        }
        setLoadingHeal(false);
    }

    const claimPrize = async () => {
        setMessageError("");
        setLoadingClaim(true);
        try {
            await Web3Helper.Instance.getGameInstance().methods.claimPrize().send({ from: accounts[0] });
            await getNFT(accounts[0]);
            await getBigBoss();
            await getWinner();
        } catch (err: any) {
            setMessageError(err.message);
        }
        setLoadingClaim(false);
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
                setAccounts(result.accounts);
                setWeb3(result.web3);
                getNFT(result.accounts[0]);
                getBigBoss();
                getHealPrice();
                getAttackPrice();
                getWinner();
            }
        });
    }

    const verifyWinnerMatch = () => {
        return winner.toUpperCase() === accounts[0].toUpperCase();
    }

    return (
        <Layout>
            <div className="content_site">
                <Container>
                    {connected ?
                        <Row>
                            <Col sm={12} md={5}>
                                <Row>
                                    <Col>
                                        <Row>
                                            <Col>
                                                {myNFT.name ?
                                                    <CardHero status={myNFT}></CardHero>
                                                    : <div>Buy your NFT Cat to start fight with the boss.</div>}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                {!myNFT.name ||
                                                    <div className="d-grid gap-2 padding_functions">
                                                        <Button onClick={attackBoss} variant="danger" disabled={loadingAtk}>
                                                            {!loadingAtk ||
                                                                <Spinner
                                                                    as="span"
                                                                    animation="grow"
                                                                    size="sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                />}
                                                            Attack the boss!
                                                        </Button>
                                                        <Button onClick={healMyCat} variant="success" disabled={loadingHeal}>
                                                            {!loadingHeal ||
                                                                <Spinner
                                                                    as="span"
                                                                    animation="grow"
                                                                    size="sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                />}
                                                            Heal my cat! ({`${web3.utils.fromWei(healPrice, "ether")} ETH`})
                                                        </Button>
                                                        {!verifyWinnerMatch() ||
                                                            <Button onClick={claimPrize} variant="info" disabled={loadingClaim}>
                                                                {!loadingClaim ||
                                                                    <Spinner
                                                                        as="span"
                                                                        animation="grow"
                                                                        size="sm"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                    />}
                                                                Claim Prize!
                                                            </Button>
                                                        }
                                                    </div>
                                                }
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={12} md={7}>
                                <Row>
                                    <Col>
                                        <Card className='mx-auto text_align_center' style={{ width: '29rem' }}>
                                            <Card.Img variant="top" src={bigBoss.imageURI} />
                                            <Card.Body>
                                                <Card.Title>{bigBoss.name} - (<GiBroadsword /> {bigBoss.attackDamage})</Card.Title>
                                                <Card.Text>
                                                    <ProgressBar max={Number(bigBoss.maxHp)} now={Number(bigBoss.hp)} label={`${bigBoss.hp}/${bigBoss.maxHp}`} />
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <br />
                                        <Alert variant='danger' hidden={messageError === ""}>
                                            {messageError}
                                        </Alert>
                                        <Alert variant='warning' hidden={Number(bigBoss.hp) > 0}>
                                            The boss is already dead, wait for the results.
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
