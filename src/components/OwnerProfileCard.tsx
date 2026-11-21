'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  ExternalLink,
  Instagram,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { useCatalog } from '@/context/CatalogContext';
import { BUSINESS_LINKS } from '@/data/mockCatalog';

export default function OwnerProfileCard() {
  const { ownerProfile } = useCatalog();
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="rounded-2xl bg-white border border-[#E2D6C5] p-6 sm:p-9 shadow-editorial">
      <div className="flex flex-col md:flex-row md:items-start gap-6 sm:gap-9">
        {/* Avatar + Mobile Title */}
        <div className="flex items-center md:items-start gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-[#D6C8B8] bg-[#EFE6D8] shrink-0 flex items-center justify-center">
            {!imgErr ? (
              <img
                src={ownerProfile.avatarUrl}
                alt={ownerProfile.fullName}
                className="w-full h-full object-cover"
                onError={() => setImgErr(true)}
              />
            ) : (
              <span className="text-lg font-bold text-[#683B1E]">MN</span>
            )}
          </div>

          <div className="md:hidden space-y-1 min-w-0">
            <h3 className="text-base font-bold text-[#2A1D15] leading-snug truncate">
              {ownerProfile.fullName}
            </h3>
            <p className="text-xs text-[#6F5E53]">
              Kak {ownerProfile.nickname} • Founder SHEIFAST
            </p>
          </div>
        </div>

        {/* Main Content Column */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Desktop Name & Metadata */}
          <div className="hidden md:flex items-center justify-between gap-4 pb-5 border-b border-[#E2D6C5]">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#2A1D15]">
                {ownerProfile.fullName}{' '}
                <span className="font-normal text-[#6F5E53]">
                  (Kak {ownerProfile.nickname})
                </span>
              </h3>
              <p className="text-xs text-[#6F5E53]">
                Founder &amp; Personal Shopper — SHEIFAST &amp; @sheinaz.co
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F9F4EB] border border-[#E2D6C5] text-[#2A1D15] font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#683B1E]" />
                {ownerProfile.location}
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F9F4EB] border border-[#E2D6C5] text-[#2A1D15] font-semibold">
                <CreditCard className="w-3.5 h-3.5 text-[#683B1E]" />
                {ownerProfile.bankAccountInfo}
              </span>
            </div>
          </div>

          {/* Mobile Location & Verified Bank Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:hidden pb-5 border-b border-[#E2D6C5]">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#F9F4EB] border border-[#E2D6C5] text-xs text-[#2A1D15]">
              <MapPin className="w-3.5 h-3.5 text-[#683B1E] shrink-0" />
              <span className="font-medium">{ownerProfile.location}</span>
            </div>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#F9F4EB] border border-[#E2D6C5] text-xs text-[#2A1D15]">
              <CreditCard className="w-3.5 h-3.5 text-[#683B1E] shrink-0" />
              <span className="font-semibold">{ownerProfile.bankAccountInfo}</span>
            </div>
          </div>

          {/* Concise Bio */}
          <p className="text-xs sm:text-sm text-[#6F5E53] leading-relaxed max-w-2xl">
            {ownerProfile.bio}
          </p>

          {/* Symmetrical Social & Action Buttons */}
          <div className="pt-1 space-y-2.5 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-3">
            <div className="grid grid-cols-3 gap-2.5 md:contents">
              <a
                href={ownerProfile.personalInstagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[42px] px-3 sm:px-4 rounded-xl bg-[#2A1D15] hover:bg-[#683B1E] text-[#F9F4EB] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors truncate"
              >
                <Instagram className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{ownerProfile.personalInstagramHandle}</span>
              </a>

              <a
                href={BUSINESS_LINKS.instagramSheifast}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[42px] px-3 sm:px-4 rounded-xl bg-[#F9F4EB] hover:bg-[#EFE6D8] text-[#2A1D15] border border-[#E2D6C5] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors truncate"
              >
                <Instagram className="w-3.5 h-3.5 text-[#683B1E] shrink-0" />
                <span className="truncate">@sheifast</span>
              </a>

              <a
                href={BUSINESS_LINKS.instagramSheinaz}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[42px] px-3 sm:px-4 rounded-xl bg-[#F9F4EB] hover:bg-[#EFE6D8] text-[#2A1D15] border border-[#E2D6C5] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors truncate"
              >
                <Instagram className="w-3.5 h-3.5 text-[#683B1E] shrink-0" />
                <span className="truncate">@sheinaz.co</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2.5 md:contents">
              <a
                href={BUSINESS_LINKS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[42px] px-4 rounded-xl bg-[#683B1E] hover:bg-[#4F2B14] text-[#F9F4EB] text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Chat WhatsApp</span>
              </a>

              <a
                href={BUSINESS_LINKS.shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[42px] px-4 rounded-xl bg-[#F9F4EB] hover:bg-[#EFE6D8] text-[#9E2A2B] border border-[#E2D6C5] text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>Shopee Resmi</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
