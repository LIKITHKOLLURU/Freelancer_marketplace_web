import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  proposals: [],
  loading: false,
  error: null,
};

const proposalsSlice = createSlice({
  name: 'proposals',
  initialState,
  reducers: {
    setProposals: (state, action) => {
      state.proposals = action.payload;
    },
    addProposal: (state, action) => {
      state.proposals.push(action.payload);
    },
    updateProposal: (state, action) => {
      const index = state.proposals.findIndex(proposal => proposal.id === action.payload.id);
      if (index !== -1) {
        state.proposals[index] = action.payload;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setProposals, addProposal, updateProposal, setLoading, setError } = proposalsSlice.actions;
export default proposalsSlice.reducer;