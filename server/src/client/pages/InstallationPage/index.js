import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { action } from 'mobx';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import _ from 'lodash';

import InstallationHeader from '../../components/InstallationHeader';
import StatsSummary from '../../components/StatsSummary';
import LiveStats from '../../components/LiveStats';
import HistoricalStats from '../../components/HistoricalStats';
import './styles.scss';

@inject('stats', 'installations')
@observer
class InstallationPage extends Component {

    @action
    componentDidMount() {
        const { installations, stats, match: { params } } = this.props;
        stats.fetchStats(params.id)
            .then(data => {
                console.log('STATS', data)
                stats.stats = data
            })
            .catch(console.log)
        installations.fetchInstallation(params.id)
            .then(data => {
                console.log('INSTALLATION', data)
                installations.installation = data
            })
            .catch(console.log)

    }

    head() {
        return (
            <Helmet>
                <title>{`Installation`}</title>
                <meta property="og:title" content="Intallation" />
            </Helmet>
        );
    }

    render() {
        const { installations: { installation }, stats: { stats } } = this.props;
        console.log('installation', installation)
        const summary = _.get(stats, 'current.indexes[0]', {});
        const liveValues = _.get(stats, 'current.values', []);
        const historyValues = _.get(stats, 'history', []);
        const forecastValues = _.get(stats, 'forecast', []);
        console.log('LIVEVALUES', historyValues)
        // const hist

        return (
            <div className="installation-page">
                {this.head()}
                <div className="installation-page__row">
                    <InstallationHeader installation={installation} />
                    <StatsSummary summary={summary} />
                </div>
                <LiveStats values={liveValues} />
                <HistoricalStats history={historyValues} forecast={forecastValues} />
            </div>
        );
    }
}

export default {
    component: withRouter(InstallationPage),
    loadData: (state, params) => {
        return {
            promise: Promise.all([
                state.stats.fetchStats(params.id),
                state.installations.fetchInstallation(params.id)
            ]),
            callback: data => {
                state.stats.stats = data[0];
                state.installations.installation = data[1];
            }
        }
    }
}