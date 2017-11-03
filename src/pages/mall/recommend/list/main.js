import Vue from 'vue';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  name: 'mall-company-list',
  data() {
    return {
      companyList: [],
      currentPage:0
    }
  },
  components: {
    companyRecommendGrid: require('@/components/mall/companyRecommendGrid/item.vue'),
    InfiniteLoading,
    placeholder: require('@/components/placeholder/item.vue')
  },
  computed: {
    mallId() {
      return this.$store.state.route.params.mallId;
    },
    isMyMall() {
      const myMallId = Number(this.$store.state.myMall.mall.id);
      return Number(this.mallId) === myMallId;
    }
  },
  methods: {
    backtop() {
      $("body,html").animate({scrollTop:0},500);
    },
    onListInfinite() {
      this.fetchCompanyList();
    },
    reloadList() {
      this.companyList = [];
      this.currentPage = 0;
      this.$nextTick(() => {
        this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    fetchCompanyList() {
      Vue.$http.get(`${process.env.apiMall}/memberAd/lists`,{
        params:{
          mallId:this.mallId,
          page:this.currentPage,
          singlePage:12
        }
      }).then((response) => {
        let lists = response.data;
        if (lists.length) {
          this.currentPage += 1;
          this.companyList = this.companyList.concat(lists);
          this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:loaded');
          if (lists.length < 10) {
            this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:complete');
          }
        } else {
          this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:complete');
        }
      })
    }
  }
};