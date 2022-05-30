﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Reservation.Data;

#nullable disable

namespace Reservation.Migrations
{
    [DbContext(typeof(ReservationContext))]
    partial class ReservationContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("Reservation.Entities.Hall", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("Columns")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Rows")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Halls");
                });

            modelBuilder.Entity("Reservation.Entities.Reservation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.HasKey("Id");

                    b.ToTable("Reservations");
                });

            modelBuilder.Entity("Reservation.Entities.Seat", b =>
                {
                    b.Property<int>("HallId")
                        .HasColumnType("int");

                    b.Property<int>("Row")
                        .HasColumnType("int");

                    b.Property<int>("Column")
                        .HasColumnType("int");

                    b.Property<float>("PriceMultiplier")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("real")
                        .HasDefaultValue(1f);

                    b.HasKey("HallId", "Row", "Column");

                    b.ToTable("Seats");
                });

            modelBuilder.Entity("ReservationSeat", b =>
                {
                    b.Property<int>("ReservationsId")
                        .HasColumnType("int");

                    b.Property<int>("SeatsHallId")
                        .HasColumnType("int");

                    b.Property<int>("SeatsRow")
                        .HasColumnType("int");

                    b.Property<int>("SeatsColumn")
                        .HasColumnType("int");

                    b.HasKey("ReservationsId", "SeatsHallId", "SeatsRow", "SeatsColumn");

                    b.HasIndex("SeatsHallId", "SeatsRow", "SeatsColumn");

                    b.ToTable("ReservationSeat");
                });

            modelBuilder.Entity("Reservation.Entities.Reservation", b =>
                {
                    b.OwnsOne("Reservation.Entities.Movie", "Movie", b1 =>
                        {
                            b1.Property<int>("ReservationId")
                                .HasColumnType("int");

                            b1.Property<int>("Id")
                                .HasColumnType("int");

                            b1.Property<string>("Title")
                                .IsRequired()
                                .HasColumnType("nvarchar(max)");

                            b1.HasKey("ReservationId");

                            b1.ToTable("Reservations");

                            b1.WithOwner()
                                .HasForeignKey("ReservationId");
                        });

                    b.OwnsOne("Reservation.Entities.Screening", "Screening", b1 =>
                        {
                            b1.Property<int>("ReservationId")
                                .HasColumnType("int");

                            b1.Property<int>("Id")
                                .HasColumnType("int");

                            b1.Property<DateTime>("MovieStart")
                                .HasColumnType("datetime2");

                            b1.HasKey("ReservationId");

                            b1.ToTable("Reservations");

                            b1.WithOwner()
                                .HasForeignKey("ReservationId");
                        });

                    b.OwnsOne("Reservation.Entities.User", "User", b1 =>
                        {
                            b1.Property<int>("ReservationId")
                                .HasColumnType("int");

                            b1.Property<string>("Email")
                                .IsRequired()
                                .HasColumnType("nvarchar(max)");

                            b1.Property<string>("Firstname")
                                .IsRequired()
                                .HasColumnType("nvarchar(max)");

                            b1.Property<string>("Id")
                                .IsRequired()
                                .HasColumnType("nvarchar(max)");

                            b1.Property<string>("Lastname")
                                .IsRequired()
                                .HasColumnType("nvarchar(max)");

                            b1.HasKey("ReservationId");

                            b1.ToTable("Reservations");

                            b1.WithOwner()
                                .HasForeignKey("ReservationId");
                        });

                    b.Navigation("Movie")
                        .IsRequired();

                    b.Navigation("Screening")
                        .IsRequired();

                    b.Navigation("User")
                        .IsRequired();
                });

            modelBuilder.Entity("Reservation.Entities.Seat", b =>
                {
                    b.HasOne("Reservation.Entities.Hall", null)
                        .WithMany("Seats")
                        .HasForeignKey("HallId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ReservationSeat", b =>
                {
                    b.HasOne("Reservation.Entities.Reservation", null)
                        .WithMany()
                        .HasForeignKey("ReservationsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Reservation.Entities.Seat", null)
                        .WithMany()
                        .HasForeignKey("SeatsHallId", "SeatsRow", "SeatsColumn")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Reservation.Entities.Hall", b =>
                {
                    b.Navigation("Seats");
                });
#pragma warning restore 612, 618
        }
    }
}
