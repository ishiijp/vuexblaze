import pathify, { make } from 'vuex-pathify'
import { findIndex, last, cloneDeep } from 'lodash'
import settings from '~/settings'

export const plugins = [pathify.plugin]

export const state = () => ({
  currentStepId: null,
  stepResults: [],
})

export const getters = {
  ...make.getters(state),
  settings() {
    return settings
  },
  currentStepSettings(state, getters) {
    return getters.settings.steps.find((x) => x.stepId === state.currentStepId)
  },
  currentStepResult(state) {
    return state.stepResults.find((x) => x.stepId === state.currentStepId)
  },
  nextStepId(state, getters) {
    if (!getters.currentStepSettings.postProcess) return null

    // TODO ugly but it works fine :p
    const stepId = getters.currentStepSettings.postProcess.conditionalDestinations?.reduce(
      (stepId, config) => {
        if (stepId) return stepId
        const bool = config.conditions.reduce(
          (bool, { stepId, partId, field, operator, value }) => {
            const partResult = state.stepResults
              .find((step) => step.stepId === stepId)
              ?.parts.find((part) => part.partId === partId)
            const b = partResult?.form[field] === value // TODO deal with operator
            return config.conditionType === 'AND' ? bool && b : bool || b
          },
          true
        )
        return bool ? config.destination : null
      },
      null
    )
    return stepId || getters.currentStepSettings.postProcess.defaultDestination
  },
  hasNextStep(state, getters) {
    return Boolean(getters.nextStepId)
  },
  previousStepId(state) {
    if (!state.stepResults.length) return null
    const currentIndex = findIndex(
      state.stepResults,
      ({ stepId }) => stepId === state.currentStepId
    )
    if (currentIndex === 0) return null
    if (currentIndex < 0) return last(state.stepResults).stepId
    return state.stepResults[currentIndex - 1].stepId
  },
  hasPreviousStep(state, getters) {
    return Boolean(getters.previousStepId)
  },
}

export const mutations = {
  ...make.mutations(state),
  ADD_STEP_RESULT(state, result) {
    state.stepResults.push(result)
  },
  REPLACE_STEP_RESULT(state, result) {
    const index = state.stepResults.findIndex((x) => x.stepId === result.stepId)
    state.stepResults.splice(index, 1, result)
  },
}

export const actions = {
  init({ commit, state }) {
    if (!state.currentStepId) {
      commit('SET_CURRENT_STEP_ID', settings.initialStepId)
    }
  },
  saveStepResult({ getters, commit }, result) {
    if (getters.currentStepResult) {
      commit('REPLACE_STEP_RESULT', cloneDeep(result))
    } else {
      commit('ADD_STEP_RESULT', cloneDeep(result))
    }
  },
  goNextStep({ getters, commit }) {
    commit('SET_CURRENT_STEP_ID', getters.nextStepId)
  },
  goPreviousStep({ getters, commit }) {
    commit('SET_CURRENT_STEP_ID', getters.previousStepId)
  },
}
