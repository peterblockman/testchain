package keeper_test

import (
	"testing"

	testkeeper "testchain/testutil/keeper"
	"testchain/x/testchain/types"

	"github.com/stretchr/testify/require"
)

func TestGetParams(t *testing.T) {
	k, ctx := testkeeper.TestchainKeeper(t)
	params := types.DefaultParams()

	k.SetParams(ctx, params)

	require.EqualValues(t, params, k.GetParams(ctx))
}
