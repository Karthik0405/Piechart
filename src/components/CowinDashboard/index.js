// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    vaccinationCoveragelist: [],
    ageVaccinationList: [],
    genderVaccinationList: [],
    status: apiStatus.initial,
  }

  componentDidMount() {
    this.gettingVaccinationCoverage()
  }

  gettingVaccinationCoverage = async () => {
    this.setState({
      status: apiStatus.inProgress,
    })
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (response.ok === true) {
      const data = await response.json()
      const vaccinationCoverageData = data.last_7_days_vaccination
      const vaccinationByAge = data.vaccination_by_age
      const vaccinationByGender = data.vaccination_by_gender
      this.setState({
        vaccinationCoveragelist: vaccinationCoverageData,
        ageVaccinationList: vaccinationByAge,
        genderVaccinationList: vaccinationByGender,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  gettingHeading = () => (
    <div>
      <div className="cowin-logo-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          alt="website logo"
          className="website-logo"
        />
        <h1 className="website-heading">Co-WIN</h1>
      </div>
      <h1 className="website-description">CoWIN Vaccination in India</h1>
    </div>
  )

  renderReport = () => {
    const {vaccinationCoveragelist, genderVaccinationList, ageVaccinationList} =
      this.state
    return (
      <>
        <VaccinationCoverage vaccinationData={vaccinationCoveragelist} />
        <VaccinationByGender vaccinationGender={genderVaccinationList} />
        <VaccinationByAge vaccinationAge={ageVaccinationList} />
      </>
    )
  }

  renderFailure = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-msg">Something went wrong</h1>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader-class">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderResult = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.inProgress:
        return this.renderLoader()
      case apiStatus.success:
        return this.renderReport()
      case apiStatus.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cowin-bg-container">
        {this.gettingHeading()}
        {this.renderResult()}
      </div>
    )
  }
}

export default CowinDashboard
