import { Client, registry, MissingWalletError } from 'testchain-client-ts'

import { PacketState } from "testchain-client-ts/ibc.core.channel.v2/types"
import { PacketSequence } from "testchain-client-ts/ibc.core.channel.v2/types"
import { Packet } from "testchain-client-ts/ibc.core.channel.v2/types"
import { Payload } from "testchain-client-ts/ibc.core.channel.v2/types"
import { Acknowledgement } from "testchain-client-ts/ibc.core.channel.v2/types"
import { RecvPacketResult } from "testchain-client-ts/ibc.core.channel.v2/types"


export { PacketState, PacketSequence, Packet, Payload, Acknowledgement, RecvPacketResult };

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
				NextSequenceSend: {},
				PacketCommitment: {},
				PacketCommitments: {},
				PacketAcknowledgement: {},
				PacketAcknowledgements: {},
				PacketReceipt: {},
				UnreceivedPackets: {},
				UnreceivedAcks: {},
				
				_Structure: {
						PacketState: getStructure(PacketState.fromPartial({})),
						PacketSequence: getStructure(PacketSequence.fromPartial({})),
						Packet: getStructure(Packet.fromPartial({})),
						Payload: getStructure(Payload.fromPartial({})),
						Acknowledgement: getStructure(Acknowledgement.fromPartial({})),
						RecvPacketResult: getStructure(RecvPacketResult.fromPartial({})),
						
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
				getNextSequenceSend: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.NextSequenceSend[JSON.stringify(params)] ?? {}
		},
				getPacketCommitment: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PacketCommitment[JSON.stringify(params)] ?? {}
		},
				getPacketCommitments: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PacketCommitments[JSON.stringify(params)] ?? {}
		},
				getPacketAcknowledgement: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PacketAcknowledgement[JSON.stringify(params)] ?? {}
		},
				getPacketAcknowledgements: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PacketAcknowledgements[JSON.stringify(params)] ?? {}
		},
				getPacketReceipt: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.PacketReceipt[JSON.stringify(params)] ?? {}
		},
				getUnreceivedPackets: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.UnreceivedPackets[JSON.stringify(params)] ?? {}
		},
				getUnreceivedAcks: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.UnreceivedAcks[JSON.stringify(params)] ?? {}
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
			console.log('Vuex module: ibc.core.channel.v2 initialized!')
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
		
		
		
		 		
		
		
		async QueryNextSequenceSend({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV2.query.queryNextSequenceSend( key.client_id)).data
				
					
				commit('QUERY', { query: 'NextSequenceSend', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryNextSequenceSend', payload: { options: { all }, params: {...key},query }})
				return getters['getNextSequenceSend']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryNextSequenceSend API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPacketCommitment({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV2.query.queryPacketCommitment( key.client_id,  key.sequence)).data
				
					
				commit('QUERY', { query: 'PacketCommitment', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPacketCommitment', payload: { options: { all }, params: {...key},query }})
				return getters['getPacketCommitment']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPacketCommitment API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPacketCommitments({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV2.query.queryPacketCommitments( key.client_id, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.IbcCoreChannelV2.query.queryPacketCommitments( key.client_id, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'PacketCommitments', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPacketCommitments', payload: { options: { all }, params: {...key},query }})
				return getters['getPacketCommitments']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPacketCommitments API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPacketAcknowledgement({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV2.query.queryPacketAcknowledgement( key.client_id,  key.sequence)).data
				
					
				commit('QUERY', { query: 'PacketAcknowledgement', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPacketAcknowledgement', payload: { options: { all }, params: {...key},query }})
				return getters['getPacketAcknowledgement']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPacketAcknowledgement API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPacketAcknowledgements({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV2.query.queryPacketAcknowledgements( key.client_id, query ?? undefined)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await client.IbcCoreChannelV2.query.queryPacketAcknowledgements( key.client_id, {...query ?? {}, 'pagination.key':(<any> value).pagination.next_key} as any)).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'PacketAcknowledgements', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPacketAcknowledgements', payload: { options: { all }, params: {...key},query }})
				return getters['getPacketAcknowledgements']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPacketAcknowledgements API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryPacketReceipt({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV2.query.queryPacketReceipt( key.client_id,  key.sequence)).data
				
					
				commit('QUERY', { query: 'PacketReceipt', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryPacketReceipt', payload: { options: { all }, params: {...key},query }})
				return getters['getPacketReceipt']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryPacketReceipt API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryUnreceivedPackets({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV2.query.queryUnreceivedPackets( key.client_id,  key.sequences)).data
				
					
				commit('QUERY', { query: 'UnreceivedPackets', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryUnreceivedPackets', payload: { options: { all }, params: {...key},query }})
				return getters['getUnreceivedPackets']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryUnreceivedPackets API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryUnreceivedAcks({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const client = initClient(rootGetters);
				let value= (await client.IbcCoreChannelV2.query.queryUnreceivedAcks( key.client_id,  key.packet_ack_sequences)).data
				
					
				commit('QUERY', { query: 'UnreceivedAcks', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryUnreceivedAcks', payload: { options: { all }, params: {...key},query }})
				return getters['getUnreceivedAcks']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryUnreceivedAcks API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendQueryPacketAcknowledgementResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryPacketAcknowledgementResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketAcknowledgementResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketAcknowledgementsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryPacketAcknowledgementsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketAcknowledgementsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPacketState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendPacketState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:PacketState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSendPacket({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendMsgSendPacket({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendPacket:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSendPacket:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryNextSequenceSendRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryNextSequenceSendRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryNextSequenceSendRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryNextSequenceSendRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRecvPacket({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendMsgRecvPacket({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRecvPacket:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRecvPacket:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgRecvPacketResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendMsgRecvPacketResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRecvPacketResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgRecvPacketResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryNextSequenceSendResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryNextSequenceSendResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryNextSequenceSendResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryNextSequenceSendResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUnreceivedPacketsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryUnreceivedPacketsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedPacketsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUnreceivedPacketsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUnreceivedAcksRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryUnreceivedAcksRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedAcksRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUnreceivedAcksRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUnreceivedAcksResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryUnreceivedAcksResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedAcksResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUnreceivedAcksResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketCommitmentsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryPacketCommitmentsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketCommitmentsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendGenesisState({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendGenesisState({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:GenesisState:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgTimeout({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendMsgTimeout({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTimeout:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgTimeout:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPacket({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendPacket({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Packet:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Packet:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPayload({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendPayload({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Payload:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Payload:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketReceiptRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryPacketReceiptRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketReceiptRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketReceiptRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryUnreceivedPacketsResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryUnreceivedPacketsResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedPacketsResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryUnreceivedPacketsResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketReceiptResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryPacketReceiptResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketReceiptResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketReceiptResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketAcknowledgementRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryPacketAcknowledgementRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketAcknowledgementRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgAcknowledgement({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendMsgAcknowledgement({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAcknowledgement:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgAcknowledgement:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendRecvPacketResult({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendRecvPacketResult({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RecvPacketResult:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:RecvPacketResult:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketCommitmentRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryPacketCommitmentRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketCommitmentRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketCommitmentsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryPacketCommitmentsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketCommitmentsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketAcknowledgementsRequest({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryPacketAcknowledgementsRequest({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementsRequest:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketAcknowledgementsRequest:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendPacketSequence({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendPacketSequence({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketSequence:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:PacketSequence:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgTimeoutResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendMsgTimeoutResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTimeoutResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgTimeoutResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgAcknowledgementResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendMsgAcknowledgementResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAcknowledgementResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgAcknowledgementResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendQueryPacketCommitmentResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendQueryPacketCommitmentResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:QueryPacketCommitmentResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendMsgSendPacketResponse({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendMsgSendPacketResponse({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendPacketResponse:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSendPacketResponse:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		async sendAcknowledgement({ rootGetters }, { value, fee = {amount: [], gas: "200000"}, memo = '' }) {
			try {
				const client=await initClient(rootGetters)
				const fullFee = Array.isArray(fee)  ? {amount: fee, gas: "200000"} :fee;
				const result = await client.IbcCoreChannelV2.tx.sendAcknowledgement({ value, fee: fullFee, memo })
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Acknowledgement:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:Acknowledgement:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async QueryPacketAcknowledgementResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryPacketAcknowledgementResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketAcknowledgementResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketAcknowledgementsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryPacketAcknowledgementsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketAcknowledgementsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async PacketState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.packetState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:PacketState:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSendPacket({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.msgSendPacket({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendPacket:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSendPacket:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryNextSequenceSendRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryNextSequenceSendRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryNextSequenceSendRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryNextSequenceSendRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRecvPacket({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.msgRecvPacket({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRecvPacket:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRecvPacket:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgRecvPacketResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.msgRecvPacketResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgRecvPacketResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgRecvPacketResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryNextSequenceSendResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryNextSequenceSendResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryNextSequenceSendResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryNextSequenceSendResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUnreceivedPacketsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryUnreceivedPacketsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedPacketsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUnreceivedPacketsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUnreceivedAcksRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryUnreceivedAcksRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedAcksRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUnreceivedAcksRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUnreceivedAcksResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryUnreceivedAcksResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedAcksResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUnreceivedAcksResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketCommitmentsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryPacketCommitmentsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketCommitmentsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async GenesisState({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.genesisState({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:GenesisState:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:GenesisState:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgTimeout({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.msgTimeout({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTimeout:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgTimeout:Create Could not create message: ' + e.message)
				}
			}
		},
		async Packet({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.packet({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Packet:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Packet:Create Could not create message: ' + e.message)
				}
			}
		},
		async Payload({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.payload({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Payload:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Payload:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketReceiptRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryPacketReceiptRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketReceiptRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketReceiptRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryUnreceivedPacketsResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryUnreceivedPacketsResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryUnreceivedPacketsResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryUnreceivedPacketsResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketReceiptResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryPacketReceiptResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketReceiptResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketReceiptResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketAcknowledgementRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryPacketAcknowledgementRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketAcknowledgementRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgAcknowledgement({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.msgAcknowledgement({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAcknowledgement:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgAcknowledgement:Create Could not create message: ' + e.message)
				}
			}
		},
		async RecvPacketResult({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.recvPacketResult({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:RecvPacketResult:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:RecvPacketResult:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketCommitmentRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryPacketCommitmentRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketCommitmentRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketCommitmentsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryPacketCommitmentsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketCommitmentsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketAcknowledgementsRequest({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryPacketAcknowledgementsRequest({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketAcknowledgementsRequest:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketAcknowledgementsRequest:Create Could not create message: ' + e.message)
				}
			}
		},
		async PacketSequence({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.packetSequence({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:PacketSequence:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:PacketSequence:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgTimeoutResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.msgTimeoutResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgTimeoutResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgTimeoutResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgAcknowledgementResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.msgAcknowledgementResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgAcknowledgementResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgAcknowledgementResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async QueryPacketCommitmentResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.queryPacketCommitmentResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:QueryPacketCommitmentResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:QueryPacketCommitmentResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async MsgSendPacketResponse({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.msgSendPacketResponse({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendPacketResponse:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSendPacketResponse:Create Could not create message: ' + e.message)
				}
			}
		},
		async Acknowledgement({ rootGetters }, { value }) {
			try {
				const client=initClient(rootGetters)
				const msg = await client.IbcCoreChannelV2.tx.acknowledgement({value})
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:Acknowledgement:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:Acknowledgement:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}