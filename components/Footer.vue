<template>
  <nav>
    <ul>
      <li v-for="item in getRouteList()" :key="item.id">

        <nuxt-link v-if="item.active" :to="`/${item.route}`">
          {{ item.title }}
        </nuxt-link>
        <div v-else-if="!item.active">
          {{ item.title }}
        </div>

      </li>
    </ul>
    <ul>
      <li v-for="item in getFooterList()" :key="item.id">
        <a :href="item.href" target="_blank">
          {{ item.title }}
        </a>
      </li>
    </ul>
  </nav>
</template>
<script>

// [.Footer]:
// [Start]:
// |/*|:
// #[Start]:

/* istanbul ignore next */
export default {
  data () {
    return {
      footer: {
        routes:[
          // [TOU]: /tou
          {
            "id": 1,
            "title": "Terms of Use",
            "label": "TOU",
            "route": "tou",
            "active": true
          },
          // [Opportunity]: /opportunity
          {
            "id": 2,
            "title": "Opportunity",
            "label": "Opportunity",
            "route": "opportunity",
            "active": true
          },
          // [Sponsor]: /sponsor
          {
            "id": 3,
            "title": "Sponsor",
            "label": "Sponsor",
            "route": "sponsor",
            "active": true
          },
          // [Statistic]: /statistic
          {
            "id": 4,
            "title": "Statistic",
            "label": "Statistic",
            "route": "statistic",
            "active": true
          },
          // [About]: /about
          {
            "id": 5,
            "title": "About",
            "label": "About",
            "route": "about",
            "active": true
          }
        ],
        footerList: [
          // [Github]:
          // |github.com/citizenlabsgr|:
          {
            "id": 1,
            "title": "Github",
            "href": "https://github.com/citizenlabsgr"
          },
          // [Slack]:
          // |/slack.com|:
          {
            "id": 2,
            "title": "Slack",
            "href": "https://slack.com"
          }
        ]
      }
      // #[End]:
    }
  },
  methods: {
    getRouteList() {
      return this.footer.routes;
    },
    getFooterList() {
      return this.footer.footerList;
    }
  }
}



// [End]:
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow:row wrap;
  justify-content: center;
  align-items: center;
}

li {
  margin: 20px 10px 0px 20px;
  font-variant: petite-caps;
}

img {
  height: 50px
}
</style>
