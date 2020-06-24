import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import CondorView from '../views/CondorView.vue'
import OptionGraph from '../views/OptionGraph.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/condors',
      name: 'Condor',
      component: CondorView
    },
    {
      path: '/options',
      name: 'Option Graph',
      component: OptionGraph
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  ]
})

export default router
