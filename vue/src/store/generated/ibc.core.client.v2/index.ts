import { Client, registry, MissingWalletError } from 'testchain-client-ts'

import { Config } from "testchain-client-ts/ibc.core.client.v2/types"
import { CounterpartyInfo } from "testchain-client-ts/ibc.core.client.v2/types"
import { GenesisCounterpartyInfo } from "testchain-client-ts/ibc.core.client.v2/types"


export { Config, CounterpartyInfo, GenesisCounterpartyInfo };

function initClient(vuexGetters) {
	return new Client(vuexGetters['common/env/getEnv'], vuexGetters['common/wallet/signer'])
}

function mergeResults(value, next_values) {
	for (let prop of Object.keys(next_values)) {
		if (Array.isArray(next_values[prop])) {
			value[prop]=[...value[prop], ...next_values[prop]]
		}else{
			value[prop]=next_values[prop]
		}
	}
	return value
}

type Field = {
	name: string;
	type: unknown;
}
function getStructure(template) {
	let structure: {fields: Field[]} = { fields: [] }
	for (const [key, value] of Object.entries(template)) {
		let field = { name: key, type: typeof value }
		structure.fields.push(field)
	}
	return structure
}
const getDefaultState = () => {
	return {
				CounterpartyInfo: {},
				Config: {},
				
				_Structure: {
						Config: getStructure(Config.fromPartial({})),
						CounterpartyInfo: getStructure(CounterpartyInfo.fromPartial({})),
						GenesisCounterpartyInfo: getStructure(GenesisCounterpartyInfo.fromPartial({})),
						
		},
		_Registry: registry,
		_Subscriptions: new Set(),
	}
}

// initial state
const state = getDefaultState()

export default {
	namespaced: true,
	state,
	mutations: {
		RESET_STATE(state) {
			Object.assign(state, getDefaultState())
		},
		QUERY(state, { query, key, value }) {
			state[query][JSON.stringify(key)] = value
		},
		SUBSCRIBE(state, subscription) {
			state._Subscriptions.add(JSON.stringify(subscription))
		},
		UNSUBSCRIBE(state, subscription) {
			state._Subscriptions.delete(JSON.stringify(subscription))
		}
	},
	getters: {
				getCounterpartyInfo: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.CounterpartyInfo[JSON.stringify(params)] ?? {}
		},
				getConfig: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Config[JSON.stringify(params)] ?? {}
		},
				
		getTypeStructure: (state) => (type) => {
			return state._Structure[type].fields
		},
		getRegistry: (state) => {
			return state._Registry
		}
	},
	actions: {
		init({ dispatch, rootGetters }) {
			console.log('Vuex module: ibc.core.client.v2 initialized!')
			if (rootGetters['common/env/client']) {
				rootGetters['common/env/client'].on('newblock', () => {
					dispatch('StoreUpdate')
				})
			}
		},
		resetState({ commit }) {
			commit('RESET_STATE')
		},
		unsubscribe({ commit }, subscription) {
			commit('UNSUBSCRIBE', subscription)
		},
		async StoreUpdate({ state, dispatch }) {
			state._Subscriptions.forEach(async (subscription) => {
				try {
					const sub=JSON.parse(subscription)
					await dispatch(sub.action, sub.payload)
				}catch(e) {
					throw new Error('Subscriptions: ' + e.message)
				}
			})
		},
		
		
		
		 		
		
		
		async QueryCounterpartyInfo({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreClientV2.query.queryCounterpartyInfo( key.client_id)).data
				
					
				commit('QUERY', { query: 'CounterpartyInfo', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryCounterpartyInfo', payload: { options: { all }, params: {...key},query }})
				return getters['getCounterpartyInfo']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryCounterpartyInfo API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryConfig({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreClientV2.query.queryConfig( key.client_id)).data
				
					
				commit('QUERY', { query: 'Config', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryConfig', payload: { options: { all }, params: {...key},query }})
				return getters['getConfig']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryConfig API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendQueryCounterpartyInfoResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreClientV2.tx.sendQueryCounterpartyInfoResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCounterpartyInfoResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCounterpartyInfoResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateClientConfig({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreClientV2.tx.sendMsgUpdateClientConfig({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateClientConfig:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateClientConfig:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisCounterpartyInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreClientV2.tx.sendGenesisCounterpartyInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisCounterpartyInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisCounterpartyInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreClientV2.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRegisterCounterpartyResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreClientV2.tx.sendMsgRegisterCounterpartyResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterCounterpartyResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRegisterCounterpartyResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendConfig({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreClientV2.tx.sendConfig({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Config:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Config:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendCounterpartyInfo({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreClientV2.tx.sendCounterpartyInfo({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CounterpartyInfo:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:CounterpartyInfo:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryCounterpartyInfoRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreClientV2.tx.sendQueryCounterpartyInfoRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCounterpartyInfoRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryCounterpartyInfoRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConfigResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreClientV2.tx.sendQueryConfigResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConfigResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConfigResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryConfigRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreClientV2.tx.sendQueryConfigRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConfigRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryConfigRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRegisterCounterparty({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreClientV2.tx.sendMsgRegisterCounterparty({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterCounterparty:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRegisterCounterparty:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgUpdateClientConfigResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreClientV2.tx.sendMsgUpdateClientConfigResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateClientConfigResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgUpdateClientConfigResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async QueryCounterpartyInfoResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreClientV2.tx.queryCounterpartyInfoResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCounterpartyInfoResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCounterpartyInfoResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateClientConfig({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreClientV2.tx.msgUpdateClientConfig({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateClientConfig:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateClientConfig:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisCounterpartyInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreClientV2.tx.genesisCounterpartyInfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisCounterpartyInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisCounterpartyInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreClientV2.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRegisterCounterpartyResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreClientV2.tx.msgRegisterCounterpartyResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterCounterpartyResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRegisterCounterpartyResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Config({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreClientV2.tx.config({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Config:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Config:Create Could not create message: ' + e.message)
				}
			}
		},
		async CounterpartyInfo({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreClientV2.tx.counterpartyInfo({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:CounterpartyInfo:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:CounterpartyInfo:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryCounterpartyInfoRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreClientV2.tx.queryCounterpartyInfoRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryCounterpartyInfoRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryCounterpartyInfoRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConfigResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreClientV2.tx.queryConfigResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConfigResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConfigResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryConfigRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreClientV2.tx.queryConfigRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryConfigRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryConfigRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRegisterCounterparty({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreClientV2.tx.msgRegisterCounterparty({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRegisterCounterparty:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRegisterCounterparty:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgUpdateClientConfigResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreClientV2.tx.msgUpdateClientConfigResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgUpdateClientConfigResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgUpdateClientConfigResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}