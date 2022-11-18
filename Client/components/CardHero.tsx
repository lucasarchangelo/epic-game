import React from "react";
import { Card, Col, ProgressBar, Row } from "react-bootstrap";
import { AiOutlineTag } from "react-icons/ai";
import { GiBroadsword } from "react-icons/gi";

interface Props {
    status: {
        characterIndex: string;
        attackDamage: string;
        hp: string;
        imageURI: string;
        maxHp: string;
        name: string;
    }
}

export default function CardHero(props: Props) {
    return (
        <Card className="margin_botton_cards" style={{ width: '18rem' }}>
            <Card.Img variant="top" src={props.status.imageURI} />
            <Card.Body className='text_align_center'>
                <Card.Title>{props.status.name}</Card.Title>
                <Card.Text>
                    <ProgressBar max={Number(props.status.maxHp)} now={Number(props.status.hp)} label={`${props.status.hp}/${props.status.maxHp}`} />
                    <Row>
                        <Col>
                            <AiOutlineTag /> {props.status.characterIndex}
                        </Col>
                        <Col>
                            <GiBroadsword /> {props.status.attackDamage}
                        </Col>
                    </Row>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
