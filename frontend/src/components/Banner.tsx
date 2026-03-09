import React, { useEffect, useState } from "react"

type BannerItem = {
  id: string
  title: string
  subtitle?: string
  image?: string
  link?: string
}

export default function Banner() {

  const [banner, setBanner] = useState<BannerItem | null>(null)

  /*
  LOAD BANNER
  */

  useEffect(() => {

    loadBanner()

  }, [])


  /*
  FETCH BANNER
  */

  const loadBanner = async () => {

    try {

      // MVP mock banner
      const data: BannerItem = {
        id: "promo1",
        title: "🔥 Double TON Weekend",
        subtitle: "Win up to 50 TON",
        image: "https://dummyimage.com/600x100/111/fff&text=WheelWin",
        link: "https://t.me"
      }

      setBanner(data)

    } catch (err) {

      console.error("Banner load error", err)

    }

  }


  /*
  CLICK
  */

  const handleClick = () => {

    if (!banner?.link) return

    window.open(banner.link, "_blank")

  }


  if (!banner) return null


  return (

    <div
      className="banner"
      onClick={handleClick}
    >

      {banner.image && (

        <img
          src={banner.image}
          className="banner-image"
        />

      )}

      <div className="banner-content">

        <div className="banner-title">
          {banner.title}
        </div>

        {banner.subtitle && (

          <div className="banner-subtitle">
            {banner.subtitle}
          </div>

        )}

      </div>

    </div>

  )

}
