import VuexBlazeCollection from './classes/VuexBlazeCollection'
import vuexblazePlugin from './plugin'
import vuexblazeTypes from './types'
import vuexblazeOptions from './options'

function collection(collectionName) {
  return new VuexBlazeCollection(collectionName)
}

export { collection, vuexblazeTypes, vuexblazeOptions, vuexblazePlugin }
