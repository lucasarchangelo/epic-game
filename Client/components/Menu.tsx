import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar, Nav } from "react-bootstrap";
import styles from "./styles/Menu.module.css";
import { Web3Helper, Web3Object } from "../helpers/web3_helper";

const Menu = () => {
  const [accounts, setAccounts] = useState(Array<string>);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    startSubject();
  }, []);

  const checkIfWalletIsConnected = async () => {
    const provider = (window as any).ethereum;
    if (provider) {
      Web3Helper.Instance.init(provider);
    }
  };

  const startSubject = async () => {
    Web3Helper.Instance.web3Objects.subscribe((result: Web3Object) => {
      setAccounts(result.accounts);
      setConnected(result.connected);
    });
  };

  return (
    <Navbar
      bg="primary"
      variant="dark"
      fixed="top"
      expand="lg"
      className={`shadow ${styles.nav_padding}`}
    >
      <Link href="/"><Navbar.Brand>Cats vs Dogs Chain</Navbar.Brand></Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Link href="/"><Nav.Link href="/">Home</Nav.Link></Link>
          <Link href="/nft/"><Nav.Link href="/nft/">NFT Cat</Nav.Link></Link>
          <Link href="/fight/"><Nav.Link href="/fight/">Fight</Nav.Link></Link>
          <Link href="/ranking/"><Nav.Link href="/ranking/">Ranking</Nav.Link></Link>
        </Nav>
      </Navbar.Collapse>
      {!connected ? (
        <button className="btn btn-success" onClick={checkIfWalletIsConnected}>
          Connect
        </button>
      ) : (
        <span className={styles.nav_color}>{accounts[0]}</span>
      )}
    </Navbar>
  );
};

export default Menu;
