<template>
  <v-card
    elevation="4"
    class="mx-4"
    >
    <v-overlay v-show="this.$store.getters.isLoading">Loading...</v-overlay>
    <v-simple-table
      class="my-2"
      fixed-header
      height="100%"
      dense
      >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center"><v-icon>mdi-menu</v-icon></th>
            <th class="text-left">Name</th>
            <th class="text-left">Datum</th>
            <th class="text-right">Betrag</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="item in getExpensesCurrentMonth" 
            :key="item._id" 
          >
            <td>
              <v-row v-if="item.name === getUserDetails.name || getUserDetails.role === 'ADMIN'">
                <v-col class="text-center">
                  <UpdateExpense
                    :id="item._id"
                    :amount="item.amount"
                  />
                </v-col>
                <v-col>
                  <DeleteExpense                     
                    :id="item._id"
                  />
                </v-col>
              </v-row>
            </td>
            <td class="text-left">{{ item.name }}</td>
            <td class="text-left">{{ moment(item.createdAt).format('DD.MM.YYYY') }}</td>
            <td class="text-right">{{ parseFloat(item.amount).toFixed(2) }} €
            </td>                           
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import UpdateExpense from './UpdateExpense'
import DeleteExpense from './DeleteExpense'
import { mapGetters } from 'vuex'

export default {
  components: {
    UpdateExpense,
    DeleteExpense
  },
  computed: {
    ...mapGetters(['getUserDetails', 'getExpensesCurrentMonth'])
  }
}
</script>