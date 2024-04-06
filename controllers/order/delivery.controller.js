const {Deliivery} = require("../../models/order/delivery.schema");
const {Percentprofit} = require("../../models/percentprofit/percentprofit.schema");
const {Shareincome} = require("../../models/shareincome/shareincome.schema");
const {Customer} = require("../../models/customer/customer.schema");
const { object } = require("joi");

module.exports.get = async (req, res) => {
    try{
        
        const delivery = await Deliivery.find().populate('order_id').populate('customer_id')
        return res.status(200).send({ status: true, data: delivery })
    }catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.getbyid = async (req, res) => {
    try{
        const delivery = await Deliivery.findOne({ _id: req.params.id }).populate('order_id').populate('customer_id')
        return res.status(200).send({ status: true, data: delivery })
    }
    catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.getbycustomer = async (req, res) => {
    try{
        const delivery = await Deliivery.find({ customer_id: req.params.id}).populate('order_id').populate('customer_id')
        return res.status(200).send({ status: true, data: delivery })
    }catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports.getbymaruey = async (req, res) => {
    try{
        
        const data = await Deliivery.find({partner_name:"บริษัท มารวยด้วยกัน จำกัด"}).populate('order_id').populate('customer_id')
        return res.status(200).send({ status: true, data: data })
    }catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports.getbypartner = async (req, res) => {
    try{
        console.log("test")
        const data = await Deliivery.find({partner_id:req.params.id}).populate('order_id').populate('customer_id')
        return res.status(200).send({ status: true, data: data })
    }catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}

//ส่งสินค้าให้กับขนส่งแล้ว
module.exports.sendproduct = async (req, res) => {
    try{
        //เช็คก่อนว่า delivery นี้มีอยู่หรือไม่
        const delivery = await Deliivery.findOne({ _id: req.params.id })
        //เช็คว่ายังเป็นสถานะ "กำลังเตรียมจัดส่ง"
        if(delivery.status != "กำลังเตรียมจัดส่ง") return res.status(400).send({ status: false, message: "สินค้าได้ส่งไปแล้ว" })
        //เปลี่ยนสถานะเป็น "จัดส่งสินค้า"
        delivery.status = "จัดส่งสินค้า"
        //เพิ่มข้อมูลลง detail
        delivery.detail.push({ status: "จัดส่งสินค้า", date: Date.now() })
        //save
        const add = await delivery.save()
      
        
        return res.status(200).send({ status: true, message: "จัดส่งสินค้าสำเร็จ", data: add })
    }catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}

//ลูกค้ากดรับสินค้าแล้ว
module.exports.getproduct = async (req, res) => {
    try{
        //เช็คก่อนว่า delivery นี้มีอยู่หรือไม่
        const delivery = await Deliivery.findOne({ _id: req.params.id })
        if(delivery == null) return res.status(400).send({ status: false, message: "ไม่พบข้อมูล" })
        //เช็คว่ายังเป็นสถานะ "จัดส่งสินค้า"
        if(delivery.status != "จัดส่งสินค้า") return res.status(400).send({ status: false, message: "สินค้ายังไม่ถึง" })
        //เปลี่ยนสถานะเป็น "ได้รับสินค้าแล้ว"
        delivery.status = "ได้รับสินค้าแล้ว"
        //เพิ่มข้อมูลลง detail
        delivery.detail.push({ status: "ได้รับสินค้าแล้ว", date: Date.now() })
        //save
        const add = await delivery.save()
        //แบ่งรายได้
        const percentprofit = await Percentprofit.findOne()
        //เช็คว่าเป็น partner หรือ maruey
        let maruey = 0
        let partner = 0
        let sharelinkproduct = 0
        let uplinelv1 = 0
        let uplinelv2 = 0
        let uplinelv3 = 0
        let uplinelv4 = 0
        let uplinelv5 = 0
        let uplinelv6 = 0
        let uplinelv7 = 0
        let uplinelv8 = 0
        let uplinelv9 = 0
        let uplinelv10 = 0
        
        //ใช้เป็นตัวแปรหักเงิน
        let customer = 0
        let uplineall = 0 //รวมเงินทั้งหมดของ upline
        //ขั้นตอนที่ 1 หักให้ partner และ แชร์ลิงค์
        if(delivery.partner_name == "บริษัท มารวยด้วยกัน จำกัด"){
            //เพิ่มรายได้ให้ maruey
            maruey =delivery.totalproduct * (percentprofit.percentmaruey.owner/100)
            customer = delivery.totalproduct * (percentprofit.percentmaruey.sharelink/100)
           
        }
        else{
            //เพิ่มรายได้ให้ partner และ แพลตฟอร์ม
            partner =delivery.alltotal * percentprofit.percentpartner.owner/100
            const platfrom =delivery.alltotal * percentprofit.percentpartner.platform/100
            // เอาจาก platfrom มาแบ่งให้ maruey และ customer
            maruey = platfrom * percentprofit.percentpartner.separateplatform.platform/100
            customer = platfrom * percentprofit.percentpartner.separateplatform.sharelink/100
        }
        

        //ขั้นตอนที่ 2 หักเงินให้ upline และ แชร์ลิงค์
        sharelinkproduct = customer * percentprofit.percentcustomer.shareproduct/100
        uplineall = customer * percentprofit.percentcustomer.sharelink/100
        //ขั้นตอนที่ 3 แบ่งเงินให้ upline 10 ระดับ
        uplinelv1 = uplineall * percentprofit.sharelink.level_one/100
        uplinelv2 = uplineall * percentprofit.sharelink.level_two/100
        uplinelv3 = uplineall * percentprofit.sharelink.level_three/100
        uplinelv4 = uplineall * percentprofit.sharelink.level_four/100
        uplinelv5 = uplineall * percentprofit.sharelink.level_five/100
        uplinelv6 = uplineall * percentprofit.sharelink.level_six/100
        uplinelv7 = uplineall * percentprofit.sharelink.level_seven/100
        uplinelv8 = uplineall * percentprofit.sharelink.level_eight/100
        uplinelv9 = uplineall * percentprofit.sharelink.level_nine/100
        uplinelv10 = uplineall * percentprofit.sharelink.level_ten/100
        

        //เช็ค partner ว่ามีอยู่หรือไม่
        let objectpartner = null
        if(delivery.partner_name != "บริษัท มารวยด้วยกัน จำกัด")
        {
            objectpartner = {
                partner_id:delivery.partner_id,
                money:partner
            }
        }
       
       
       
        //เช็คว่ามีคนแชร์ลิงค์ไหม
        let codeshareproduct = ""
        
        let objectsshareproduct 
        delivery.product.forEach(async (element) => {
            if(element.sharelinkcode != "" && element.sharelinkcode != null)
            {
                codeshareproduct = element.sharelinkcode   
            }  
        })



        if(codeshareproduct ==  "")
        {
            //ถ้าไม่มีคนแชร์ลิงค์ ให้เพิ่มเข้าไปใน maruey
            maruey = maruey + sharelinkproduct
           
            sharelinkproduct = 0;
            objectsshareproduct = null
        }else{
            const customer_id = await Customer.findOne({referralcode:codeshareproduct})
            if(customer_id == null) {
                 //ถ้าไม่มีคนแชร์ลิงค์ ให้เพิ่มเข้าไปใน maruey
                maruey = maruey + sharelinkproduct
                sharelinkproduct = 0;
                objectsshareproduct = null
            }else{
                objectsshareproduct = {
                    customer_id:customer_id?._id ,
                    money:sharelinkproduct
                }
                const addmoney = await Customer.findByIdAndUpdate(objectsshareproduct?.customer_id,{$inc:{money:sharelinkproduct}})
            }
            
        }

        let objectlevelone 
        let objectleveltwo 
        let objectlevelthree
        let objectlevelfour 
        let objectlevelfive 
        let objectlevelsix 
        let objectlevelseven 
        let objectleveleight 
        let objectlevelnine 
        let objectlevelten 
        //เช็คว่ามี upline ไหม
        const customerdata =  await Customer.findById(delivery.customer_id) ;
        if(customerdata)
        {
            if(customerdata.upline != null && customerdata.upline != undefined){
                //ถ้ามีให้สร้าง object ขึ้นมา แล้ว นำ cusomer id มาใส่ แล้ว เงินที่จะต้องได้ และ เพิ่มให้คนที่เป็น upline เลย
                if(customerdata.upline.level_one != null && customerdata.upline.level_one != undefined){
                    objectlevelone = {
                        customer_id:customerdata.upline.level_one,
                        money:uplinelv1
                    }
                    const addmoney = await Customer.findByIdAndUpdate(customerdata.upline.level_one,{$inc:{money:uplinelv1}})

                }else{
                    //ถ้าไม่มี upline ให้เพิ่มเข้าไปใน maruey
                    maruey = maruey + uplinelv1
                    uplinelv1 = 0
                    objectlevelone = null
                } 

                if(customerdata.upline.level_two != null && customerdata.upline.level_two != undefined){
                    objectleveltwo = {
                        customer_id:customerdata.upline.level_two,
                        money:uplinelv2
                    }
                    const addmoney = await Customer.findByIdAndUpdate(customerdata.upline.level_two,{$inc:{money:uplinelv2}})
                }else{
                    maruey = maruey + uplinelv2
                    uplinelv2 = 0
                    objectleveltwo = null
                }


                if(customerdata.upline.level_three != null && customerdata.upline.level_three != undefined){
                    objectlevelthree = {
                        customer_id:customerdata.upline.level_three,
                        money:uplinelv3
                    }
                    const addmoney = await Customer.findByIdAndUpdate(customerdata.upline.level_three,{$inc:{money:uplinelv3}})
                }else{
                    maruey = maruey + uplinelv3
                    uplinelv3 = 0
                    objectlevelthree = null
                }


                if(customerdata.upline.level_four != null && customerdata.upline.level_four != undefined){
                    objectlevelfour = {
                        customer_id:customerdata.upline.level_four,
                        money:uplinelv4
                    }
                    const addmoney = await Customer.findByIdAndUpdate(customerdata.upline.level_four,{$inc:{money:uplinelv4}})
                }else{
                    maruey = maruey + uplinelv4
                    uplinelv4 = 0
                    objectlevelfour = null
                }

                if(customerdata.upline.level_five != null && customerdata.upline.level_five != undefined){
                    objectlevelfive = {
                        customer_id:customerdata.upline.level_five,
                        money:uplinelv5
                    }
                    const addmoney = await Customer.findByIdAndUpdate(customerdata.upline.level_five,{$inc:{money:uplinelv5}})
                }else{
                    maruey = maruey + uplinelv5
                    uplinelv5 = 0
                    objectlevelfive = null
                }

                if(customerdata.upline.level_six != null && customerdata.upline.level_six != undefined){
                    objectlevelsix = {
                        customer_id:customerdata.upline.level_six,
                        money:uplinelv6
                    }
                    const addmoney = await Customer.findByIdAndUpdate(customerdata.upline.level_six,{$inc:{money:uplinelv6}})
                }else{
                    maruey = maruey + uplinelv6
                    uplinelv6 = 0
                    objectlevelsix = null
                }

                if(customerdata.upline.level_seven != null && customerdata.upline.level_seven != undefined){
                    objectlevelseven = {
                        customer_id:customerdata.upline.level_seven,
                        money:uplinelv7
                    }
                    const addmoney = await Customer.findByIdAndUpdate(customerdata.upline.level_seven,{$inc:{money:uplinelv7}})
                }else{
                    maruey = maruey + uplinelv7
                    uplinelv7 = 0
                    objectlevelseven = null
                }

                if(customerdata.upline.level_eight != null && customerdata.upline.level_eight != undefined){
                    objectleveleight = {
                        customer_id:customerdata.upline.level_eight,
                        money:uplinelv8
                    }
                    const addmoney = await Customer.findByIdAndUpdate(customerdata.upline.level_eight,{$inc:{money:uplinelv8}})
                }else{
                    maruey = maruey + uplinelv8
                    uplinelv8 = 0
                    objectleveleight = null
                }

                if(customerdata.upline.level_nine != null && customerdata.upline.level_nine != undefined){
                    objectlevelnine = {
                        customer_id:customerdata.upline.level_nine,
                        money:uplinelv9
                    }
                    const addmoney = await Customer.findByIdAndUpdate(customerdata.upline.level_nine,{$inc:{money:uplinelv9}})
                }else{
                    maruey = maruey + uplinelv9
                    uplinelv9 = 0
                    objectlevelnine = null
                }
                
                if(customerdata.upline.level_ten != null && customerdata.upline.level_ten != undefined){
                    objectlevelten = {
                        customer_id:customerdata.upline.level_ten,
                        money:uplinelv10
                    }
                    const addmoney = await Customer.findByIdAndUpdate(customerdata.upline.level_ten,{$inc:{money:uplinelv10}})
                }else{
                    maruey = maruey + uplinelv10
                    uplinelv10 = 0
                    objectlevelten = null
                }
                
           } 
        }else{
            //ถ้าไม่มี upline ให้เพิ่มเข้าไปใน maruey
            maruey = maruey + uplinelv1 + uplinelv2 + uplinelv3 + uplinelv4 + uplinelv5 + uplinelv6 + uplinelv7 + uplinelv8 + uplinelv9 + uplinelv10
            uplinelv1 = 0
            uplinelv2 = 0
            uplinelv3 = 0
            uplinelv4 = 0
            uplinelv5 = 0
            uplinelv6 = 0
            uplinelv7 = 0
            uplinelv8 = 0
            uplinelv9 = 0
            uplinelv10 = 0
      

        }
       
        

     

        //เพิ่มข้อมูลลง shareincome
        const data = new Shareincome({
            order_id: delivery.order_id,
            delivery_id: delivery._id,
            alltotal: delivery.alltotal,
            maruey: maruey,
            partner: objectpartner,
            customer: {
                shareproduct:objectsshareproduct, // คนแชร์ลิงค์สินค้า
                level_one: objectlevelone,
                level_two: objectleveltwo,
                level_three: objectlevelthree,
                level_four: objectlevelfour,
                level_five: objectlevelfive,
                level_six: objectlevelsix,
                level_seven: objectlevelseven,
                level_eight: objectleveleight,
                level_nine: objectlevelnine,
                level_ten: objectlevelten,
            },
        })

        //save
        const shareincomesave = await data.save()

        if(add && shareincomesave){
            return res.status(200).send({ status: true, message: "รับสินค้าสำเร็จ", data: add ,shareincome:shareincomesave})
        }else{
            return res.status(400).send({ status: false, message: "รับสินค้าไม่สำเร็จ" })
        }

    
        
    }catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}



