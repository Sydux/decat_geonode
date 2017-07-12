/**
 * Copyright 2017, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Grid, Row, Col, Glyphicon, FormControl, Button, ButtonGroup, OverlayTrigger, Tooltip} = require('react-bootstrap');
const PropTypes = require('prop-types');

const Select = require('react-select');

const Message = require('../../MapStore2/web/client/components/I18N/Message');
const {DateTimePicker} = require('react-widgets');

/*const LocationFilter = connect((state) => ({
        regions: state.alerts && state.alerts.regions || {},
        regionsLoading: state.alerts && state.alerts.regionsLoading || false,
        selectedRegions: state.alerts && state.alerts.selectedRegions || []
 }), {loadRegions, selectRegions})(require('../components/LocationFilter'));*/

const LocationFilter = require('../components/LocationFilter');

class EventEditor extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        mode: PropTypes.string,
        height: PropTypes.number,
        currentEvent: PropTypes.object,
        hazards: PropTypes.array,
        levels: PropTypes.array,
        onSave: PropTypes.func,
        onChangeProperty: PropTypes.func,
        loadRegions: PropTypes.func,
        regions: PropTypes.onject,
        regionsLoading: PropTypes.bool,
        selectedRegions: PropTypes.array,
        drawEnabled: PropTypes.bool,
        onToggleDraw: PropTypes.func,
        onClose: PropTypes.func
    };

    static defaultProps = {
        className: 'd-hazard',
        onSave: () => {},
        onChangeProperty: () => {},
        loadRegions: () => {},
        onToggleDraw: () => {},
        onClose: () => {},
        cuurentEvent: {},
        mode: 'ADD',
        height: 400,
        regions: [],
        regionsLoading: false,
        drawEnabled: false
    };

    renderHazard = () => {
        if (this.props.mode === 'ADD') {
            return <Select placeholder={'Select hazard type'} options={this.props.hazards} value={this.props.currentEvent.hazard} onChange={this.selectHazard} optionRenderer={this.renderHazardOption} valueRenderer={this.renderHazardValue}/>;
        }
        return <h5 className={"fa icon-" + this.props.currentEvent.hazard.icon + " d-text-warning fa-2x"}></h5>;
    };

    renderHazardOption = (option) => {
        return (<div className="Select-value" title={option.description}>
                <span className="Select-value-label">
                    <span className={"fa icon-" + option.icon}>&nbsp;{option.name}</span>
                </span>
            </div>);
    };

    renderHazardValue = (value) => {
        return value ? (<div className="Select-value" title={value.description}>
                <span className="Select-value-label">
                    <span className={"fa icon-" + value.icon}>&nbsp;{value.name}</span>
                </span>
            </div>) : null;
    };

    renderLevelOption = (option) => {
        return (<div className="Select-value" title={option.description}>
                    <label className={"d-text-" + option.icon}>{option.description}</label>
            </div>);
    };

    renderLevelValue = (value) => {
        return value ? (<div className="Select-value" title={value.description}>
                <label className={"d-text-" + value.icon}>{value.description}</label>
            </div>) : null;
    };

    renderSource = () => {
        if (this.props.mode === 'ADD') {
            return (
                <div>
                    <Row>
                        <Col className="event-editor-divider" xs={12}><strong><Message msgId="eventeditor.from"/></strong></Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <div><Message msgId="eventeditor.name"/>:</div>
                        </Col>
                        <Col xs={6}>
                            <OverlayTrigger placement="top" overlay={<Tooltip id="eventeditor-name"><Message msgId="eventeditor.namedescription"/></Tooltip>}>
                                <Glyphicon className="pull-right" glyph="question-sign"/>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <FormControl value={this.props.currentEvent.sourceName || ''} onChange={this.changeSourceName}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <div><Message msgId="eventeditor.type"/>:</div>
                        </Col>
                        <Col xs={6}>
                            <OverlayTrigger placement="top" overlay={<Tooltip id="eventeditor-type"><Message msgId="eventeditor.typedescription"/></Tooltip>}>
                                <Glyphicon className="pull-right" glyph="question-sign"/>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <FormControl value={this.props.currentEvent.sourceType || ''} onChange={this.changeSourceType}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <div><Message msgId="eventeditor.uri"/>:</div>
                        </Col>
                        <Col xs={6}>
                            <OverlayTrigger placement="top" overlay={<Tooltip id="eventeditor-uri"><Message msgId="eventeditor.uridescription"/></Tooltip>}>
                                <Glyphicon className="pull-right" glyph="question-sign"/>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <FormControl value={this.props.currentEvent.sourceUri || ''} onChange={this.changeSourceUri}/>
                        </Col>
                    </Row>
                </div>
            );
        }
        return <span><b><Message msgId="eventeditor.from"/>:</b> {this.props.currentEvent.sourceName || ''}</span>;
    };

    renderTime = (time) => {
        if (this.props.mode === 'ADD') {
            return (<Col xs={12}><Message msgId={"eventeditor." + time + "time"}/><DateTimePicker
                value={this.props.currentEvent[time + "time"]}
                time={false}
                onChange={(date) => this.changeTime(time, date)}/></Col>);
        }
        return [<Col xs={5}><Message msgId={"eventeditor." + time + "time"}/></Col>, <Col xs={7}>{this.props.currentEvent[time + "time"]}</Col>];
    };

    renderLocation = () => {
        return (<div>
            <Row>
                <Col xs={12}>
                    <Message msgId="eventeditor.location"/>
                </Col>
            </Row>
            <Grid fluid>
                <Row>
                    <Col xs={12}>
                        <div className="input-group">
                        <FormControl/>
                        <div className="input-group-btn">
                            <Button active={this.props.drawEnabled} onClick={this.props.onToggleDraw}><Glyphicon glyph="map-marker"/></Button>
                        </div>
                        </div>
                    </Col>
                </Row>
            </Grid>
        </div>);
    };

    render() {
        return (<div>
            <div className="event-editor-container" style={{overflow: 'auto', height: this.props.height - 34 }}>
                <Grid fluid>
                    {/*
                    <Row >
                        <Col xs={2}><Glyphicon glyph="1-close" style={{cursor: "pointer"}} onClick={this.props.onClose}/></Col>
                        <Col xs={10}/>
                    </Row>
                    */}
                    <Row>
                        <Col xs={12} className="text-center"><h4>Create Alert</h4></Col>
                    </Row>
                    <Row>
                        <Col xs={12}><strong>Hazard info</strong></Col>
                    </Row>
                    <Row>
                        <Col xs={12}><FormControl className="text-center" placeholder="Enter hazard title" value={this.props.currentEvent.name || ''} onChange={this.changeName}/></Col>
                    </Row>
                    <Row className="text-center">
                        <Col xs={12}>{this.renderHazard()}</Col>
                    </Row>
                    <Row>
                        <Col xs={12} className="text-center">
                            <Select
                                options={this.props.levels}
                                placeholder={'Select hazard level'}
                                value={this.props.currentEvent.level}
                                onChange={this.selectLevel}
                                optionRenderer={this.renderLevelOption}
                                valueRenderer={this.renderLevelValue}/>
                        </Col>
                    </Row>
                    {/*
                    <Row>
                        <Col className="event-editor-divider" xs={12}><strong>Hazard time</strong></Col>
                    </Row>
                    <Row>
                        {this.renderTime('updated')}
                    </Row>
                    <Row>
                        {this.renderTime('reported')}
                    </Row>
                    */}
                    <Row>
                        <Col className="event-editor-divider" xs={12}><strong>Hazard location</strong></Col>
                    </Row>
                    {this.renderLocation()}
                    <LocationFilter regions={this.props.regions}
                        regionsLoading={this.props.regionsLoading}
                        selectedRegions={this.props.currentEvent.regions || []}
                        loadRegions={this.props.loadRegions}
                        selectRegions={this.selectRegions}
                        title="eventeditor.regions"
                        />
                    {this.renderSource()}
                    <Row>
                        <Col className="event-editor-divider" xs={12}>
                            <strong><Message msgId="eventeditor.description"/></strong>
                            <FormControl componentClass="textarea" value={this.props.currentEvent.description || ''} onChange={this.changeDescription}/>
                        </Col>
                    </Row>
                </Grid>
            </div>
            <Grid fluid>
                <Row>
                    <Col className="text-center" xs={12}>
                        <ButtonGroup className="event-editor-bottom-group">
                            <Button bsSize="sm" onClick={this.props.onClose}>Cancel</Button>
                            <Button bsSize="sm" onClick={this.props.onSave}><Message msgId="eventeditor.save"/></Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </Grid>
        </div>
        );
    }

    changeName = (e) => {
        this.props.onChangeProperty('name', e.target.value);
    };

    changeDescription = (e) => {
        this.props.onChangeProperty('description', e.target.value);
    };

    changeSourceName = (e) => {
        this.props.onChangeProperty('sourceName', e.target.value);
    };

    changeSourceType = (e) => {
        this.props.onChangeProperty('sourceType', e.target.value);
    };

    changeSourceUri = (e) => {
        this.props.onChangeProperty('sourceUri', e.target.value);
    };

    changeTime = (time, value) => {
        this.props.onChangeProperty(time + 'time', value);
    };

    selectHazard = (value) => {
        this.props.onChangeProperty('hazard', value);
    };

    selectLevel = (value) => {
        this.props.onChangeProperty('level', value);
    };

    selectRegions = (regions) => {
        this.props.onChangeProperty('regions', regions);
    };
}

module.exports = EventEditor;