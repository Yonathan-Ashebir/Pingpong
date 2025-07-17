interface MyProps {
    count: number;
    name?: string;
    nick: String;
}

function propsCall(props: MyProps) {

}

function testProps() {
    propsCall({ count: 0, nick: "nick" })
}