<template>
  <div class="block">
    <el-carousel height="350px">
      <el-carousel-item v-for="item in imgList" :key="item.id">
        <img ref="imgHeight" :src="item.idView" class="banner_img" />
      </el-carousel-item>
    </el-carousel>
    <div class="div_normal">
      <a class="index_font">期待被超越：课程为学员成长持续赋能</a>
    </div>
    <!-- 卡片展示 -->
    <div class="div_normal">
      <el-row>
        <el-col :span="7">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <img
              src="https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              class="image"
            />
            <div style="padding: 14px;">
              <span>基础语法</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <img
              src="https://images.pexels.com/photos/97077/pexels-photo-97077.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              class="image"
            />
            <div style="padding: 14px;">
              <span>真实案例</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <img
              src="https://images.pexels.com/photos/50711/board-electronics-computer-data-processing-50711.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              class="image"
            />
            <div style="padding: 14px;">
              <span>算法学习</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="div_normal">
      <a class="index_font">学习的路上，有你有我！</a>
      <tr></tr>
      <span style="font-size=25px;margin-top=10px;color=#CDC9C9">你永远不是一个人在战斗！技术人生，琢玉教育永远是你坚实的后盾！</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeNames: ['0'],
      imgList: [
        { id: 0, idView: 'https://images.pexels.com/photos/45848/kumamoto-japan-aso-cloud-45848.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1680'},
        
        {
          id: 1, idView: 'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=1680'
        },
        { id: 2, idView:'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=1680'}
      ]
    }
  },
  methods: {
    handleChange(val) {
      // console.log(val);
    }
  }
}
</script>
<style lang='less' scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.index_font {
  font-size: 40px;
}

.div_normal {
  margin-top: 30px;
  text-align: center;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
</style>