import { supabase } from '@/utils/supabase/client';
import Image from 'next/image'
import React from 'react'

const STORAGE = "profiles";

const ProfileError = () => {
  const {
    data: { publicUrl:defaultImg }
  } = supabase.storage.from(STORAGE).getPublicUrl("default");

  return (
    
    <div className="w-full flex">
      <div className="mr-10">
        <Image
          src={defaultImg}
          alt={"프로필 이미지"}
          width={200}
          height={200}
          style={{
            maxWidth: 200,
            width: "full",
            aspectRatio: "1/1",
            objectFit: "cover"
          }}
          priority
          className="border-2 border-gray-300 rounded-full"
        />
      </div>
      <div className="w-full">
          <p>
            에러가 발생했습니다.
          </p>
      </div>
    </div>
  )
}

export default ProfileError