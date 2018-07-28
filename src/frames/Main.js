import '../../shim'

import React from 'react'

import {
    // Button,
    StyleSheet,
    ScrollView,
    Text,
    View,
    WebView
} from 'react-native'

import { Navigation } from 'react-native-navigation'

import { observable } from 'mobx'
import { observer } from 'mobx-react/native'

import { Client } from 'bugsnag-react-native'

import Amplitude from 'amplitude'

import DeviceInfo from 'react-native-device-info'

import {
    Button,
    SearchBar
} from 'react-native-elements'

@observer
export default class MainFrame extends React.Component {
    @observable debug = 'loading...'

    constructor(props) {
        super(props)

        console.log('Main Frame received props', props)
        this._addLog = this._addLog.bind(this)

        // const bugsnag = new Client()
        // bugsnag.notify(new Error("TEST: First error"))

        /* Initialize amplitude. */
        const amplitude = new Amplitude('beadb78ade3fd20e320417ed123488b4')

        /* Set the event type. */
        const event_type = 'MAIN_'

        /* Retrieve device id. */
        const device_id = DeviceInfo.getUniqueID()
        console.info('Device Unique Id', device_id)

        /* Set the tracking data. */
        const trackingData = { event_type, device_id }

        /* Call amplitude api. */
        amplitude.track(trackingData)

        /* Initialize the local state. */
        // this.state = {
        //     debug: 'loading...'
        // }
    }

    render() {
        const source = {
            uri: 'https://github.com/d14na/zeronet-explorer/'
        }

        return <ScrollView>
            <View style={ styles.container }>
                <SearchBar
                    ref={ search => this.search = search }
                    icon={{ type: 'font-awesome', name: 'search' }}
                    clearIcon={{ color: 'rgba(220, 90, 90, 0.35)', type: 'font-awesome', name: 'times-circle', style: { marginRight: 5 } }}
                    inputStyle={{ paddingLeft: 40, paddingBottom: 9 }}
                    placeholder='Looking for something interesting?' />

                <View style={ styles.contentContainer }>
                    <View style={{ flexDirection: 'row', height: 100 }}>
                        <Button
                            large
                            style={{ flex: 1, width: 150 }}
                            onPress={ () => this._loadZite.bind(this)('github') }
                            icon={{name: 'globe', type: 'font-awesome'}}
                            title='GitHub' />

                        <Button
                            large
                            style={{ flex: 1, width: 150 }}
                            onPress={ () => this._loadZite.bind(this)('guide') }
                            icon={{name: 'fire', type: 'font-awesome'}}
                            title='Zer0net 101' />
                    </View>

                    <View style={{ flexDirection: 'row', height: 100 }}>
                        <Button
                            large
                            style={{ flex: 1, width: 150 }}
                            onPress={ () => this._loadZite.bind(this)('zitetags') }
                            icon={{name: 'globe', type: 'font-awesome'}}
                            title='#Zitetags' />

                        <Button
                            large
                            style={{ flex: 1, width: 150 }}
                            onPress={ () => this._loadZite.bind(this)('blog') }
                            icon={{name: 'book', type: 'font-awesome'}}
                            title='Blog' />
                    </View>

                    <View style={{ flexDirection: 'row', height: 100 }}>
                        <Button
                            large
                            style={{ flex: 1, width: 150 }}
                            onPress={ this._pex.bind(this) }
                            icon={{name: 'globe', type: 'font-awesome'}}
                            title='Peer Exchange' />

                        <Button
                            large
                            style={{ flex: 1, width: 150 }}
                            onPress={ () => this._getFile.bind(this)('1ZTAGS56qz1zDDxW2Ky19pKzvnyqJDy6J') }
                            icon={{name: 'book', type: 'font-awesome'}}
                            title='Zitetags' />
                    </View>

                    <View style={{ flexDirection: 'row', height: 100 }}>
                        <Button
                            large
                            style={{ flex: 1, width: 150 }}
                            onPress={ () => this._getFile.bind(this)('1CHESSgbNoLEvQzdSW1yreen7VxvRDk3uA') }
                            icon={{name: 'globe', type: 'font-awesome'}}
                            title='Chess' />

                        <Button
                            large
                            style={{ flex: 1, width: 150 }}
                            onPress={ () => this._getFile.bind(this)('1HeLLoyevpjZTp3pPDWkhWUNtTszN9ZzkA') }
                            icon={{name: 'book', type: 'font-awesome'}}
                            title='Hello Zero' />
                    </View>

                    <View style={{ margin: 20, padding: 20, backgroundColor: 'rgba(30, 120, 60, 0.2)'}}>
                        <Text style={{ fontStyle: 'italic' }}>
                            { this.debug }
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    }

    componentDidMount() {
        this.client = null
        this.requests = []

        /* Initialize the payload. */
        // payload = null

        this._cryptTest()
        // this._bmTest()
        // this._peerTest()
    }

    _addLog(_tag, _entry) {
        this.debug = this.debug + '\n---\n\n' + _tag + '\n' + _entry
        console.log(_tag, _entry)
    }

    _cryptTest() {
        const bmCrypto = require("../lib/bitmessage/crypto")

        const sha1 = bmCrypto.sha1(Buffer.from('test'))
        this._addLog('CRYPTO TEST 1', sha1)

        let privateKey = bmCrypto.getPrivate()
        this._addLog('CRYPTO TEST 2', privateKey)
        this._addLog('CRYPTO TEST 2 (length)', privateKey.length)

        privateKey = Buffer(32)
        privateKey.fill(1)
        const publicKey = bmCrypto.getPublic(privateKey)
        // const publicKey = bmCrypto.getPublic(privateKey).toString("hex")
        this._addLog('CRYPTO TEST 3', publicKey)
        this._addLog('CRYPTO TEST 3 (hex)', Buffer.from(publicKey).toString('hex'))
        this._addLog('CRYPTO TEST 3 (hex) (length)', Buffer.from(publicKey).length)
        // "041b84c5567b126440995d3ed5aaba0565d71e1834604819ff9c17f5e9d5dd078f70beaf8f588b541507fed6a642c5ab42dfdf8120a7f639de5122d47a69a8e8d1"

        var iv = Buffer(16);
        var ephemPublicKey = Buffer(65);
        ephemPublicKey[0] = 0x04;
        var ciphertext = Buffer("test");
        var mac = Buffer(32);
        var inopts = {
          iv: iv,
          ephemPublicKey: ephemPublicKey,
          ciphertext: ciphertext,
          mac: mac,
        };

        const encrypted = require("../lib/bitmessage/structs").encrypted
        var encoded = encrypted.encode(inopts)
        this._addLog('CRYPTO TEST 4 (encoded)', publicKey)
        this._addLog('CRYPTO TEST 4 (encoded) (length)', publicKey.length)
        // expect(encoded.length).to.equal(122);

        var outopts = encrypted.decode(encoded);
        this._addLog('CRYPTO TEST 4 (decoded)', publicKey)

        var signPrivateKey = Buffer.from('71c95d26c716a5e85e9af9efe26fb5f744dc98005a13d05d23ee92c77e038d9f', 'hex')
        var signPublicKey = bmCrypto.getPublic(signPrivateKey)
        var encPrivateKey = Buffer.from('9f9969c93c2d186787a7653f70e49be34c03c4a853e6ad0c867db0946bc433c6', 'hex')
        var encPublicKey = bmCrypto.getPublic(encPrivateKey)

        const Address = require('../lib/bitmessage/address')
        const pubkey = require("../lib/bitmessage/objects").pubkey
        const ttl = 789
        const from = Address({ signPrivateKey, encPrivateKey })
        const to = from
        const skipPow = true
        // const encPubkey = pubkey.encodeAsync({ ttl, from, to, skipPow })
        // this._addLog('CRYPTO TEST 5', JSON.stringify(encPubkey))

        var EC = require('elliptic').ec;
        var ec = new EC('curve25519')

        // Generate keys
        var key1 = ec.genKeyPair();
        var key2 = ec.genKeyPair();

        var shared1 = key1.derive(key2.getPublic());
        var shared2 = key2.derive(key1.getPublic());

        console.log('Both shared secrets are BN instances');
        console.log(shared1.toString(16));
        console.log(shared2.toString(16));
        this._addLog('CRYPTO TEST 6 (elliptic shared secrets)', shared1.toString(16) === shared2.toString(16))
        this._addLog(shared1.toString(16), shared2.toString(16))

    }

    _bmTest() {
        /* Localize this. */
        const self = this

        // const Address = require('../lib/bitmessage/address')

        // var Address = require('bitmessage').Address

        // Generate a new random Bitmessage identity.
        // var addr1 = Address.fromRandom()
        // this._addLog('New random Bitmessage address:', addr1.encode())

        // Or create it from passphrase.
        // var addr2 = Address.fromPassphrase('LondynnLee')
        // this._addLog('Deterministic Bitmessage address:', addr2.encode())
        //
        // this.bmCrypto.sha1(Buffer.from('test'))({ debug: 'Deterministic Bitmessage address: ' + addr2.encode() })

        const convert = require('xml-js')

        const json = {
            "_declaration": {
                "_attributes": {
                    "version": "1.0",
                    "encoding": "utf-8"
                }
            },
            "methodCall": {
                "methodName": "disseminatePreEncryptedMsg",
                "params": [{
                    "value": [{
                        "string": "boogy"
                    }, {
                        "string": "woogy"
                    }]
                }]
            }
            // "methodCall": {
            //     "methodName": "helloWorld",
            //     "params": [{
            //         "value": [{
            //             "string": "boogy"
            //         }, {
            //             "string": "woogy"
            //         }]
            //     }]
            // }
            // "methodCall": {
            //     "methodName": "clientStatus"
            // }
            // "methodCall": {
            //     "methodName": "add",
            //     "params": [{
            //         "value": [{
            //             "int": 1000
            //         }, {
            //             "int": 337
            //         }]
            //     }]
            // }
        }
        const xml = convert.json2xml(json, {compact: true, spaces: 4})

        const username = 'dev'
        const password = 'tester'
        const auth = {
            username,
            password
        }
        const options = { auth }

        const apiUsername = 'dev'
        const apiPassword = 'tester'
        const encoded = Buffer.from(`${apiUsername}:${apiPassword}`).toString('base64')

        const Authorization = `Basic ${encoded}`
        const Accept = 'text/xml'

        const method = 'POST'

        const headers = {
            Authorization,
            Accept,
            'Content-Type': 'text/xml'
        }

        const body = xml

        // const fetchTarget = 'http://localhost:8442'
        const fetchTarget = 'http://159.65.111.48:8442'
        const fetchOptions = { method, headers, body }

        fetch(fetchTarget, fetchOptions)
            .then((response) => response.text())
            .then((xmlResponse) => {
                self._addLog('Fetched XML Response:', xmlResponse)
                self.setState({ debug: xmlResponse + '\n\n' + body })
            })
            .catch((err) => {
                console.error(err)
            })
    }

    _peerTest() {
        const self = this

        const net = require('net')
        this._addLog('net', net)
        // OR, if not shimming via package.json "browser" field:
        // var net = require('react-native-tcp')

        const hostIp = '178.128.8.225'
        const hostPort = 13312

        // var server = net.createServer(function(socket) {
        //     socket.write('excellent!')
        // }).listen(12345)

        const host = {
            host: hostIp,
            port: hostPort
        }
        self.setState({ debug: JSON.stringify(host) })

        this.client = net.createConnection(hostPort, hostIp, () => {
            // 'connect' listener
            this._addLog('Connected to peer!')

            const pkg = self._encode(this._handshakePkg())
            self.client.write(pkg)
        })

        // this.client.on('connect', function () {
        //     console.info('Connection opened.')
        //     self.setState({ debug: 'Connection opened.' })
        //
        //     /* Create encoded package. */
        //     // const pkg = self._encode(self._handshakePkg)
        //
        //     /* Send the handshake. */
        //     // self.client.write(pkg, function () {
        //     //     // this._addLog('sent handshake', pkg)
        //     // })
        // })

        this.client.on('error', function (error) {
            this._addLog('ERROR', error)
        })

        let called = 0
        let payload = null

        this.client.on('data', function(_data) {
            if (payload) {
                payload = Buffer.concat([payload, _data])
            } else {
                payload = _data
            }

            try {
                /* Attempt to decode the data. */
                const decoded = self._decode(payload)

                this._addLog('Message #%d was received [%d bytes]', ++called + ' - ' + _data.length + '\n\n' + _data, decoded)

                /* Initialize request. */
                let request = null

                /* Retrieve the request id. */
                if (decoded.to !== null) {
                    const reqId = decoded.to
                    this._addLog('Decoded reqId', reqId)

                    /* Retrieve the request. */
                    request = self.requests[reqId]
                    this._addLog('Decoded request', request)
                }

                if (decoded.cmd === 'response' && decoded.error) {
                    console.error(decoded.error)

                    // clear the payload
                    payload = null

                    // delete the request cmd
                    delete request.cmd
                }

                if (decoded.cmd === 'response' && request.cmd === 'handshake') {
                    console.info('Handshake completed successfully!')
                    self.setState({ debug: 'Handshake completed successfully!' })

                    // clear the payload
                    payload = null
                }

                if (decoded.cmd === 'response' && request.cmd === 'ping') {
                    console.info('Ping completed successfully!')
                    self.setState({ debug: 'Ping completed successfully!' })

                    // clear the payload
                    payload = null
                }

                if (decoded.cmd === 'response' && request.cmd === 'getFile') {
                    /* Retrieve file type. */
                    const fileType = request.innerPath.split('.').pop()

                    if (fileType === 'json') {
                        let body = JSON.parse(decoded.body)

                        self._addLog('check out my JSON body', body)

                        let description = body.description
                        self._addLog('Description', description)
                    }

                    if (fileType === 'html') {
                        let body = decoded.body.toString()

                        self._addLog('check out my HTML body', body)

                        Navigation.push('zeronet.Main', {
                            component: {
                                id: 'zeronet.Webview',
                                name: 'zeronet.Webview',
                                options: {
                                    topBar: {
                                        visible: false,
                                        animate: false,
                                        drawBehind: true
                                    }
                                },
                                passProps: { html: body }
                            }
                        })

                    }

                    // clear the payload
                    payload = null
                }

                if (decoded.cmd === 'response' && request.cmd === 'pex') {
                    let peers = decoded.peers
                    // let peers = JSON.parse(decoded.peers)
                    self._addLog('check out my PEX peers', peers)

                    for (let i = 0; i < peers.length; i++) {
                        self._addLog('peer', peers[i].length, peers[i])

                        const ipBuffer = Buffer.from(peers[i])

                        if (ipBuffer.length === 6) {
                            self._addLog('#%d IP', i, ipBuffer.slice(0, 4))
                            self._addLog('#%d Port', i, ipBuffer.slice(-2))

                            const peer = {
                                ip: self._parseIp(ipBuffer.slice(0, 4)),
                                port: self._parsePort(ipBuffer.slice(-2))
                            }
                            self._addLog('PEX Peer (buffer)', peer)

                            self.hostIp = peer.ip
                            self.hostPort = peer.port
                        }
                    }

                    // clear the payload
                    payload = null
                }

                if (decoded && payload !== null) {
                    console.error('FAILED TO RECOGNIZE -- clearing payload')
                    self._addLog('DECODED', decoded)
                    self._addLog('PAYLOAD', payload)
                    self._addLog('FAILED TO RECOGNIZE', 'clearing payload')

                    // clear the payload
                    payload = null
                }

            } catch (e) {
                console.error('Failed to decode data', _data, e);
            }
        })

        this.client.on('close', function () {
            console.info('Connection closed.')
            self.setState({ debug: 'Connection closed.' })
        })
    }

    _handshakePkg() {
        const cmd = 'handshake'
        const request = { cmd }
        const req_id = this._addRequest(request)

        const crypt = null
        const crypt_supported = []
        // const crypt_supported = ['tls-rsa']
        const fileserver_port = 15441
        const protocol = 'v2'
        const port_opened = true
        const peer_id = this.state.peerId
        const rev = 2122
        const version = '0.5.6'
        const target_ip = this.state.hostIp

        /* Build parameters. */
        const params = {
            crypt,
            crypt_supported,
            fileserver_port,
            protocol,
            port_opened,
            peer_id,
            rev,
            version,
            target_ip
        }

        return { cmd, req_id, params }
    }

    _parseIp(_peer) {
        const ipBuffer = Buffer.from(_peer)

        const buf = ipBuffer.slice(0, 4)
        this._addLog('_parseIp', buf)

        const ip = buf.readUInt8(0) +
            '.' + buf.readUInt8(1) +
            '.' + buf.readUInt8(2) +
            '.' + buf.readUInt8(3)

        return ip
    }

    _parsePort(_peer) {
        const ipBuffer = Buffer.from(_peer)

        const buf = ipBuffer.slice(4, 6)
        this._addLog('_parsePort', buf)

        const port = (buf.readUInt8(1) * 256) + buf.readUInt8(0)

        return port
    }

    _addRequest(_request) {
        if (!this.reqId)
            this.reqId = 0

        /* Initialize request id (auto-increment). */
        const reqId = this.reqId++

        this.requests[reqId] = _request

        /* Return the request id. */
        return reqId
    }

    _ping() {
        const cmd = 'ping'

        const request = { cmd }

        const req_id = this._addRequest(request)

        const pkg = {
            cmd,
            req_id,
            params: {}
        }

        /* Send request. */
        this.client.write(this._encode(pkg), function () {
            this._addLog('sent ping', pkg)
        })
    }

    _getFile(_target) {
        const cmd = 'getFile'
        const innerPath = 'index.html'
        // const innerPath = 'content.json'
        // const site = '1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D'
        // const site =
        // const site = ''
        const site = _target

        const request = { cmd, innerPath, site }

        const req_id = this._addRequest(request)

        const inner_path = innerPath
        const location = 0
        const params = { site, inner_path, location }

        const pkg = { cmd, req_id, params }

        /* Send request. */
        // const pkg = self._encode(this._handshakePkg())
        this.client.write(this._encode(pkg))

        // this.client.write(this._encode(pkg), function () {
        //     this._addLog('Sent request for [ %s ]', inner_path)
        // })
    }

    _pex() {
        this._addLog('start', 'PEX...');
        const cmd = 'pex'
        const site = '1ZTAGS56qz1zDDxW2Ky19pKzvnyqJDy6J'
        const peers = []
        const peers_onion = []
        const need = 10

        const request = { cmd, site, need }

        const req_id = this._addRequest(request)

        const params = { site, peers, peers_onion, need }

        const pkg = { cmd, req_id, params }

        /* Send request. */
        this.client.write(this._encode(pkg), function () {
            this._addLog('Sent request for [ %s ]', cmd)
        })
    }

    _encode(_msg) {
        const msgpack = require('zeronet-msgpack')()
        const encode = msgpack.encode

        return encode(_msg)
    }

    _decode(_msg) {
        const msgpack = require('zeronet-msgpack')()
        const decode = msgpack.decode

        return decode(_msg)
    }

    onNavigationButtonPressed(_buttonId) {
        this._addLog('onNavigationButtonPressed', _buttonId)

        if (_buttonId === 'btnP0rtal') {
            this._openP0rtal()
        }
    }

    async _goDownload() {
        const net = require('net')
        const peer0 = require('peer0')

        this._addLog('Making download request from Peer0')

        let response = await peer0.download(net)
        this._addLog('peer0 awaiting response', response)
    }

    _loadZite(_target) {
        this._addLog('load webview with target', _target)

        this._findPeers()

        return

        Navigation.push(this.props.componentId, {
            component: {
                id: 'zeronet.Webview',
                name: 'zeronet.Webview',
                options: {
                    topBar: {
                        visible: false,
                        animate: false,
                        drawBehind: true
                    }
                },
                passProps: { ziteTag: _target }
            }
        })
    }

    _openP0rtal() {
        Navigation.mergeOptions(this.props.componentId, {
            sideMenu: {
                right: {
                    visible: true
                }
            }
        })
    }

    _findPeers() {

    }

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    },
    contentContainer: {
        padding: 20
    }
})
