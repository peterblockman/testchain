package network

import (
	"fmt"
	"testing"

	"testchain/app"

	// "github.com/cosmos/cosmos-sdk/simapp"
	"github.com/cosmos/cosmos-sdk/testutil/network"
	"github.com/stretchr/testify/require"
	tmdb "github.com/cometbft/cometbft-db"
)

type (
	Network = network.Network
	Config  = network.Config
)

// New creates instance with fully configured cosmos network.
// Accepts optional config, that will be used in place of the DefaultConfig() if provided.
func New(t *testing.T, configs ...network.Config) *network.Network {
	if len(configs) > 1 {
		panic("at most one config should be provided")
	}
	var cfg network.Config
	if len(configs) == 0 {
		cfg = DefaultConfig()
	} else {
		cfg = configs[0]
	}
	net, err := network.New(t, t.TempDir(), cfg)
	require.NoError(t, err)
	t.Cleanup(net.Cleanup)
	return net
}

// DefaultConfig will initialize config for the network with custom application,
// genesis and single validator. All other parameters are inherited from cosmos-sdk/testutil/network.DefaultConfig
// func DefaultConfig() network.Config {
// 	encoding := app.MakeEncodingConfig()
// 	return network.Config{
// 		Codec:             encoding.Marshaler,
// 		TxConfig:          encoding.TxConfig,
// 		LegacyAmino:       encoding.Amino,
// 		InterfaceRegistry: encoding.InterfaceRegistry,
// 		AccountRetriever:  authtypes.AccountRetriever{},
// 		AppConstructor: func(val network.Validator) servertypes.Application {
// 			return app.New(
// 				val.Ctx.Logger, tmdb.NewMemDB(), nil, true, map[int64]bool{}, val.Ctx.Config.RootDir, 0,
// 				encoding,
// 				simapp.EmptyAppOptions{},
// 				[]wasmkeeper.Option{
// 					func() wasmkeeper.Option {
// 						cfg := wasmkeeper.DefaultGasRegisterConfig()
// 						fmt.Printf("Using WasmGasRegisterConfig: %+v\n", cfg)
// 						return wasmkeeper.WithGasRegister(wasmkeeper.NewWasmGasRegister(cfg))
// 					}(),
// 				},

//					baseapp.SetPruning(pruningtypes.NewPruningOptionsFromString(val.AppConfig.Pruning)),
//					baseapp.SetMinGasPrices(val.AppConfig.MinGasPrices),
//				)
//			},
//			GenesisState:    app.ModuleBasics.DefaultGenesis(encoding.Marshaler),
//			TimeoutCommit:   2 * time.Second,
//			ChainID:         "chain-" + tmrand.NewRand().Str(6),
//			NumValidators:   1,
//			BondDenom:       sdk.DefaultBondDenom,
//			MinGasPrices:    fmt.Sprintf("0.000006%s", sdk.DefaultBondDenom),
//			AccountTokens:   sdk.TokensFromConsensusPower(1000, sdk.DefaultPowerReduction),
//			StakingTokens:   sdk.TokensFromConsensusPower(500, sdk.DefaultPowerReduction),
//			BondedTokens:    sdk.TokensFromConsensusPower(100, sdk.DefaultPowerReduction),
//			PruningStrategy: pruningtypes.PruningOptionNothing,
//			CleanupDir:      true,
//			SigningAlgo:     string(hd.Secp256k1Type),
//			KeyringOptions:  []keyring.Option{},
//		}
//	}
func DefaultConfig() network.Config {
	cfg, err := network.DefaultConfigWithAppConfig(app.AppConfig())
	if err != nil {
		panic(err)
	}
	ports, err := freePorts(3)
	if err != nil {
		panic(err)
	}
	if cfg.APIAddress == "" {
		cfg.APIAddress = fmt.Sprintf("tcp://0.0.0.0:%s", ports[0])
	}
	if cfg.RPCAddress == "" {
		cfg.RPCAddress = fmt.Sprintf("tcp://0.0.0.0:%s", ports[1])
	}
	if cfg.GRPCAddress == "" {
		cfg.GRPCAddress = fmt.Sprintf("0.0.0.0:%s", ports[2])
	}
	return cfg
}

// freePorts return the available ports based on the number of requested ports.
func freePorts(n int) ([]string, error) {
	closeFns := make([]func() error, n)
	ports := make([]string, n)
	for i := 0; i < n; i++ {
		_, port, closeFn, err := network.FreeTCPAddr()
		if err != nil {
			return nil, err
		}
		ports[i] = port
		closeFns[i] = closeFn
	}
	for _, closeFn := range closeFns {
		if err := closeFn(); err != nil {
			return nil, err
		}
	}
	return ports, nil
}
