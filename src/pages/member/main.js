import Vue from 'vue';
import _ from 'lodash';
import InfiniteLoading from 'vue-infinite-loading';

export default {
  name: 'chamber-company-list',
  data() {
    return {
      memberList: [],
      currentPage:0,
      chamTypeList:[],
      currentTypeId:'',
      currentChildTypeId:'',
      currentChildType:[]
    }
  },
  components: {
    companyGrid: require('@/components/companyGrid/item.vue'),
    InfiniteLoading,
    placeholder: require('@/components/placeholder/item.vue'),
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    }
  },
  mounted() {
    this.fetchChamTypeList();
  },
  methods: {
    getChamChildType(typeId){
      if(typeId){
        const currentChamTypeList = _.result(_.find(this.chamTypeList,(item)=>item.typeId === typeId),'child');
        if(currentChamTypeList.length){
          this.currentChildType = currentChamTypeList;
        }else{
          this.currentChildType = [];
        }
      }else{
        this.currentChildType = [];
      }
    },
    fetchChamTypeList(){
      Vue.$http.get(`${process.env.apiCham}/enterpriseType/lists`,{
        params:{
          withChild:1
        }
      }).then((response) => {
        this.chamTypeList = (response.data).reverse();
      })
    },
    getCurrentTypeId(typeId){
      this.currentTypeId = typeId;
      this.currentChildTypeId='';
      this.isAllowSort=0;
      this.getChamChildType(typeId);
      this.reloadList();
    },
    getCurrentChildTypeId(childTypeId){
      this.currentChildTypeId = childTypeId;
      this.getIsAllowSort(childTypeId);
      this.reloadList();
    },
    getIsAllowSort(childTypeId){
      const currentChamChildTypeList = _.find(this.currentChildType,(item)=>item.typeId === childTypeId);
      this.isAllowSort=currentChamChildTypeList.isAllowSort;
    },
    backtop() {
      $("body,html").animate({scrollTop:0},500);
    },
    onListInfinite() {
      this.fetchCurrentChamList(this.currentTypeId);
    },
    reloadList() {
      this.memberList = [];
      this.currentPage = 0;
      this.$nextTick(() => {
        this.$refs.streamInfiniteLoading.$emit('$InfiniteLoading:reset');
      });
    },
    fetchCurrentChamList(typeId){
      Vue.$http.get(`${process.env.apiCham}/commerceChamber/getMemberCompany`,{
        params:{
          commerceChamberId:this.chamId,
          typeId:this.currentTypeId,
          childTypeId:this.currentChildTypeId,
          page: this.currentPage,
          singlePage: 12
        }
      }).then((response) => {
        let lists = response.data;
        if (lists.length) {
          this.currentPage += 1;
          this.memberList = this.memberList.concat(lists);
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
}
